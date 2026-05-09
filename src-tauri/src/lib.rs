mod capture;
mod commands;
mod db;
mod models;

use std::sync::Arc;

use commands::{
    capture_commands::{get_operations, open_folder, take_screenshot},
    case_commands::{create_case, delete_case, list_cases, update_case},
    project_commands::{create_project, delete_project, list_projects, update_project},
    run_commands::{
        abort_run, add_step, delete_run, end_run, get_run, list_runs, list_steps, start_run,
        update_step,
    },
    stats_commands::get_stats,
    suite_commands::{create_suite, delete_suite, list_suites, update_suite},
};
use tauri::Manager;

#[tauri::command]
async fn open_url(app: tauri::AppHandle, url: String) -> Result<(), String> {
    use tauri_plugin_opener::OpenerExt;
    app.opener()
        .open_url(url, None::<&str>)
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let handle = app.handle().clone();

            // DB初期化
            let pool = tauri::async_runtime::block_on(db::init(&handle))
                .expect("failed to initialize database");
            handle.manage(pool);

            // グローバル録音状態を初期化してrdevリスナー起動
            let capture = Arc::new(capture::CaptureState::new());
            capture::spawn_listener(capture.clone());
            handle.manage(capture);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // プロジェクト
            create_project,
            list_projects,
            update_project,
            delete_project,
            // スイート
            create_suite,
            list_suites,
            update_suite,
            delete_suite,
            // ケース
            create_case,
            list_cases,
            update_case,
            delete_case,
            // ラン
            start_run,
            end_run,
            abort_run,
            list_runs,
            get_run,
            delete_run,
            // ステップ
            add_step,
            list_steps,
            update_step,
            // キャプチャ
            take_screenshot,
            get_operations,
            open_folder,
            // 統計
            get_stats,
            // URL
            open_url,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
