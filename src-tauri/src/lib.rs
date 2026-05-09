mod commands;
mod db;
mod models;

use commands::{
    case_commands::{create_case, delete_case, list_cases, update_case},
    project_commands::{create_project, delete_project, list_projects, update_project},
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
            let pool = tauri::async_runtime::block_on(db::init(&handle))
                .expect("failed to initialize database");
            handle.manage(pool);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_project,
            list_projects,
            update_project,
            delete_project,
            create_suite,
            list_suites,
            update_suite,
            delete_suite,
            create_case,
            list_cases,
            update_case,
            delete_case,
            open_url,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
