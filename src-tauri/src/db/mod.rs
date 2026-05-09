use sqlx::{Pool, Sqlite, SqlitePool};
use tauri::Manager;

pub mod migrations;

pub type DbPool = Pool<Sqlite>;

pub async fn init(app: &tauri::AppHandle) -> Result<DbPool, Box<dyn std::error::Error>> {
    let app_data = app.path().app_data_dir()?;
    std::fs::create_dir_all(&app_data)?;

    let db_path = app_data.join("saigen.db");
    let db_url = format!("sqlite:{}?mode=rwc", db_path.display());

    let pool = SqlitePool::connect(&db_url).await?;
    migrations::run(&pool).await?;

    Ok(pool)
}
