use crate::{db::DbPool, models::TestSuite};
use chrono::Utc;
use uuid::Uuid;

#[tauri::command]
pub async fn create_suite(
    pool: tauri::State<'_, DbPool>,
    name: String,
    description: String,
) -> Result<TestSuite, String> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    sqlx::query(
        "INSERT INTO test_suites (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&name)
    .bind(&description)
    .bind(&now)
    .bind(&now)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    Ok(TestSuite {
        id,
        name,
        description,
        created_at: now.clone(),
        updated_at: now,
    })
}

#[tauri::command]
pub async fn list_suites(pool: tauri::State<'_, DbPool>) -> Result<Vec<TestSuite>, String> {
    sqlx::query_as::<_, TestSuite>(
        "SELECT id, name, description, created_at, updated_at FROM test_suites ORDER BY created_at DESC",
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_suite(
    pool: tauri::State<'_, DbPool>,
    id: String,
    name: String,
    description: String,
) -> Result<TestSuite, String> {
    let now = Utc::now().to_rfc3339();

    sqlx::query(
        "UPDATE test_suites SET name = ?, description = ?, updated_at = ? WHERE id = ?",
    )
    .bind(&name)
    .bind(&description)
    .bind(&now)
    .bind(&id)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    sqlx::query_as::<_, TestSuite>(
        "SELECT id, name, description, created_at, updated_at FROM test_suites WHERE id = ?",
    )
    .bind(&id)
    .fetch_one(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_suite(pool: tauri::State<'_, DbPool>, id: String) -> Result<(), String> {
    sqlx::query("DELETE FROM test_suites WHERE id = ?")
        .bind(&id)
        .execute(pool.inner())
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}
