use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc, Mutex,
};

use chrono::Utc;
use rdev::{Event, EventType};

use crate::models::OperationEvent;

/// アプリ全体で共有する録音状態
pub struct CaptureState {
    pub ops: Arc<Mutex<Vec<OperationEvent>>>,
    pub is_recording: Arc<AtomicBool>,
    last_mouse: Arc<Mutex<(f64, f64)>>,
}

impl CaptureState {
    pub fn new() -> Self {
        Self {
            ops: Arc::new(Mutex::new(Vec::new())),
            is_recording: Arc::new(AtomicBool::new(false)),
            last_mouse: Arc::new(Mutex::new((0.0, 0.0))),
        }
    }

    /// 録音開始：バッファをクリアしてフラグをON
    pub fn start(&self) {
        self.ops.lock().unwrap().clear();
        self.is_recording.store(true, Ordering::SeqCst);
    }

    /// 録音停止：フラグをOFFにして記録済みイベントを返す
    pub fn stop(&self) -> Vec<OperationEvent> {
        self.is_recording.store(false, Ordering::SeqCst);
        self.ops.lock().unwrap().clone()
    }
}

/// アプリ起動時に1回だけ呼ぶ。rdev::listenはブロッキングなので専用スレッドで実行
pub fn spawn_listener(state: Arc<CaptureState>) {
    std::thread::spawn(move || {
        if let Err(e) = rdev::listen(move |event: Event| {
            if !state.is_recording.load(Ordering::Relaxed) {
                // 録音中でなければマウス位置のみ追跡
                if let EventType::MouseMove { x, y } = event.event_type {
                    *state.last_mouse.lock().unwrap() = (x, y);
                }
                return;
            }

            let ts = Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true);

            let op: Option<OperationEvent> = match &event.event_type {
                EventType::MouseMove { x, y } => {
                    *state.last_mouse.lock().unwrap() = (*x, *y);
                    None // 移動は記録しない（クリック座標として使用）
                }
                EventType::ButtonPress(button) => {
                    let (x, y) = *state.last_mouse.lock().unwrap();
                    Some(OperationEvent {
                        timestamp: ts,
                        event_type: "click".to_string(),
                        x: Some(x),
                        y: Some(y),
                        button: Some(format!("{:?}", button).to_lowercase()),
                        key: None,
                        value: None,
                        screenshot_ref: None,
                    })
                }
                EventType::KeyPress(key) => Some(OperationEvent {
                    timestamp: ts,
                    event_type: "keypress".to_string(),
                    x: None,
                    y: None,
                    button: None,
                    key: Some(format!("{:?}", key)),
                    value: None,
                    screenshot_ref: None,
                }),
                EventType::Wheel { delta_x, delta_y } => {
                    let (x, y) = *state.last_mouse.lock().unwrap();
                    Some(OperationEvent {
                        timestamp: ts,
                        event_type: "scroll".to_string(),
                        x: Some(x),
                        y: Some(y),
                        button: None,
                        key: None,
                        value: Some(format!("{},{}", delta_x, delta_y)),
                        screenshot_ref: None,
                    })
                }
                _ => None,
            };

            if let Some(op) = op {
                if let Ok(mut ops) = state.ops.lock() {
                    ops.push(op);
                }
            }
        }) {
            eprintln!("[capture] rdev listen error: {:?}", e);
        }
    });
}
