use tauri::Manager;

use crate::models::OperationEvent;

#[tauri::command]
pub async fn take_screenshot(
    app: tauri::AppHandle,
    run_id: String,
    step_number: i64,
) -> Result<String, String> {
    use screenshots::Screen;

    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let ss_dir = data_dir
        .join("tests")
        .join(&run_id)
        .join("screenshots");
    std::fs::create_dir_all(&ss_dir).map_err(|e| e.to_string())?;

    let ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis();

    let filename = format!("step_{:03}_{}.png", step_number, ms);
    let path = ss_dir.join(&filename);

    let screens = Screen::all().map_err(|e| format!("スクリーン取得失敗: {:?}", e))?;
    let screen = screens
        .into_iter()
        .next()
        .ok_or("スクリーンが見つかりません")?;

    let image = screen
        .capture()
        .map_err(|e| format!("キャプチャ失敗: {:?}", e))?;

    image
        .save(&path)
        .map_err(|e| format!("PNG保存失敗: {:?}", e))?;

    Ok(filename)
}

#[tauri::command]
pub async fn get_operations(
    app: tauri::AppHandle,
    run_id: String,
) -> Result<Vec<OperationEvent>, String> {
    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let ops_path = data_dir
        .join("tests")
        .join(&run_id)
        .join("operations.json");

    if !ops_path.exists() {
        return Ok(Vec::new());
    }

    let content = std::fs::read_to_string(&ops_path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn open_folder(app: tauri::AppHandle, run_id: String) -> Result<(), String> {
    use tauri_plugin_opener::OpenerExt;

    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let run_dir = data_dir.join("tests").join(&run_id);
    let path = run_dir.to_string_lossy().to_string();

    app.opener()
        .open_path(path, None::<&str>)
        .map_err(|e| e.to_string())
}
