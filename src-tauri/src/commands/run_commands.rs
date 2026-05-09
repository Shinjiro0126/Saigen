use std::sync::Arc;

use chrono::Utc;
use sqlx::{Pool, Sqlite};
use tauri::{Manager, State};
use uuid::Uuid;

use crate::capture::CaptureState;
use crate::models::{TestRun, TestStep};

fn run_dir(app: &tauri::AppHandle, run_id: &str) -> Result<std::path::PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("tests")
        .join(run_id);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

#[tauri::command]
pub async fn start_run(
    pool: State<'_, Pool<Sqlite>>,
    app: tauri::AppHandle,
    capture: State<'_, Arc<CaptureState>>,
    case_id: String,
) -> Result<TestRun, String> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    let dir = run_dir(&app, &id)?;
    let screenshots_dir = dir.join("screenshots");
    std::fs::create_dir_all(&screenshots_dir).map_err(|e| e.to_string())?;

    let ops_path = dir.join("operations.json").to_string_lossy().to_string();
    let ss_dir = screenshots_dir.to_string_lossy().to_string();

    sqlx::query(
        "INSERT INTO test_runs (id, case_id, status, started_at, ops_path, screenshots_dir)
         VALUES (?, ?, 'running', ?, ?, ?)",
    )
    .bind(&id)
    .bind(&case_id)
    .bind(&now)
    .bind(&ops_path)
    .bind(&ss_dir)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    capture.start();

    sqlx::query_as::<_, TestRun>("SELECT * FROM test_runs WHERE id = ?")
        .bind(&id)
        .fetch_one(pool.inner())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn end_run(
    pool: State<'_, Pool<Sqlite>>,
    capture: State<'_, Arc<CaptureState>>,
    run_id: String,
    status: String,
    notes: String,
) -> Result<TestRun, String> {
    let ops = capture.stop();
    let now = Utc::now().to_rfc3339();

    let run = sqlx::query_as::<_, TestRun>("SELECT * FROM test_runs WHERE id = ?")
        .bind(&run_id)
        .fetch_one(pool.inner())
        .await
        .map_err(|e| e.to_string())?;

    if let Some(ref path) = run.ops_path {
        let json = serde_json::to_string_pretty(&ops).map_err(|e| e.to_string())?;
        std::fs::write(path, json).map_err(|e| e.to_string())?;
    }

    sqlx::query("UPDATE test_runs SET status = ?, ended_at = ?, notes = ? WHERE id = ?")
        .bind(&status)
        .bind(&now)
        .bind(&notes)
        .bind(&run_id)
        .execute(pool.inner())
        .await
        .map_err(|e| e.to_string())?;

    sqlx::query_as::<_, TestRun>("SELECT * FROM test_runs WHERE id = ?")
        .bind(&run_id)
        .fetch_one(pool.inner())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn abort_run(
    pool: State<'_, Pool<Sqlite>>,
    capture: State<'_, Arc<CaptureState>>,
    run_id: String,
) -> Result<(), String> {
    capture.stop();
    let now = Utc::now().to_rfc3339();

    sqlx::query("UPDATE test_runs SET status = 'aborted', ended_at = ? WHERE id = ?")
        .bind(&now)
        .bind(&run_id)
        .execute(pool.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn list_runs(
    pool: State<'_, Pool<Sqlite>>,
    case_id: String,
) -> Result<Vec<TestRun>, String> {
    sqlx::query_as::<_, TestRun>(
        "SELECT * FROM test_runs WHERE case_id = ? ORDER BY started_at DESC",
    )
    .bind(&case_id)
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_run(
    pool: State<'_, Pool<Sqlite>>,
    run_id: String,
) -> Result<TestRun, String> {
    sqlx::query_as::<_, TestRun>("SELECT * FROM test_runs WHERE id = ?")
        .bind(&run_id)
        .fetch_one(pool.inner())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_run(
    pool: State<'_, Pool<Sqlite>>,
    run_id: String,
) -> Result<(), String> {
    sqlx::query("DELETE FROM test_runs WHERE id = ?")
        .bind(&run_id)
        .execute(pool.inner())
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn add_step(
    pool: State<'_, Pool<Sqlite>>,
    run_id: String,
    description: String,
    status: String,
) -> Result<TestStep, String> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    let step_number: i64 = sqlx::query_scalar(
        "SELECT COALESCE(MAX(step_number), 0) + 1 FROM test_steps WHERE run_id = ?",
    )
    .bind(&run_id)
    .fetch_one(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    sqlx::query(
        "INSERT INTO test_steps (id, run_id, step_number, description, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&run_id)
    .bind(step_number)
    .bind(&description)
    .bind(&status)
    .bind(&now)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    sqlx::query_as::<_, TestStep>("SELECT * FROM test_steps WHERE id = ?")
        .bind(&id)
        .fetch_one(pool.inner())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn list_steps(
    pool: State<'_, Pool<Sqlite>>,
    run_id: String,
) -> Result<Vec<TestStep>, String> {
    sqlx::query_as::<_, TestStep>(
        "SELECT * FROM test_steps WHERE run_id = ? ORDER BY step_number ASC",
    )
    .bind(&run_id)
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_step(
    pool: State<'_, Pool<Sqlite>>,
    id: String,
    description: String,
    status: String,
    screenshot: Option<String>,
) -> Result<TestStep, String> {
    sqlx::query(
        "UPDATE test_steps SET description = ?, status = ?, screenshot = ? WHERE id = ?",
    )
    .bind(&description)
    .bind(&status)
    .bind(&screenshot)
    .bind(&id)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    sqlx::query_as::<_, TestStep>("SELECT * FROM test_steps WHERE id = ?")
        .bind(&id)
        .fetch_one(pool.inner())
        .await
        .map_err(|e| e.to_string())
}
