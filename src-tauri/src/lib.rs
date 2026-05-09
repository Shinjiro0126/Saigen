mod commands;
mod db;
mod models;

use tauri::Manager;

use commands::{
    case_commands::{create_case, delete_case, list_cases, update_case},
    suite_commands::{create_suite, delete_suite, list_suites, update_suite},
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            let pool = tauri::async_runtime::block_on(db::init(&handle))
                .expect("failed to initialize database");
            handle.manage(pool);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_suite,
            list_suites,
            update_suite,
            delete_suite,
            create_case,
            list_cases,
            update_case,
            delete_case,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
