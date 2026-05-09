use sqlx::{Pool, Sqlite};
use tauri::State;
use serde::Serialize;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct RecentRunItem {
    pub run_id: String,
    pub case_id: String,
    pub case_name: String,
    pub status: String,
    pub started_at: String,
    pub ended_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct AppStats {
    pub project_count: i64,
    pub suite_count: i64,
    pub case_count: i64,
    pub run_count: i64,
    pub passed_count: i64,
    pub failed_count: i64,
    pub recent_runs: Vec<RecentRunItem>,
}

#[tauri::command]
pub async fn get_stats(pool: State<'_, Pool<Sqlite>>) -> Result<AppStats, String> {
    let project_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM projects")
        .fetch_one(pool.inner()).await.map_err(|e| e.to_string())?;

    let suite_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM test_suites")
        .fetch_one(pool.inner()).await.map_err(|e| e.to_string())?;

    let case_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM test_cases")
        .fetch_one(pool.inner()).await.map_err(|e| e.to_string())?;

    let run_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM test_runs WHERE status != 'running'",
    )
    .fetch_one(pool.inner()).await.map_err(|e| e.to_string())?;

    let passed_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM test_runs WHERE status = 'passed'",
    )
    .fetch_one(pool.inner()).await.map_err(|e| e.to_string())?;

    let failed_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM test_runs WHERE status = 'failed'",
    )
    .fetch_one(pool.inner()).await.map_err(|e| e.to_string())?;

    let recent_runs = sqlx::query_as::<_, RecentRunItem>(
        "SELECT r.id AS run_id, r.case_id, c.name AS case_name,
                r.status, r.started_at, r.ended_at
         FROM test_runs r
         JOIN test_cases c ON r.case_id = c.id
         WHERE r.status != 'running'
         ORDER BY r.started_at DESC
         LIMIT 8",
    )
    .fetch_all(pool.inner()).await.map_err(|e| e.to_string())?;

    Ok(AppStats {
        project_count,
        suite_count,
        case_count,
        run_count,
        passed_count,
        failed_count,
        recent_runs,
    })
}
