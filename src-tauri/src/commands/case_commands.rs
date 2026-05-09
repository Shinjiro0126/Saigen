use crate::{db::DbPool, models::TestCase};
use chrono::Utc;
use uuid::Uuid;

#[tauri::command]
pub async fn create_case(
    pool: tauri::State<'_, DbPool>,
    suite_id: String,
    name: String,
    description: String,
    priority: String,
) -> Result<TestCase, String> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    sqlx::query(
        "INSERT INTO test_cases (id, suite_id, name, description, priority, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&suite_id)
    .bind(&name)
    .bind(&description)
    .bind(&priority)
    .bind(&now)
    .bind(&now)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    Ok(TestCase {
        id,
        suite_id,
        name,
        description,
        priority,
        created_at: now.clone(),
        updated_at: now,
    })
}

#[tauri::command]
pub async fn list_cases(
    pool: tauri::State<'_, DbPool>,
    suite_id: String,
) -> Result<Vec<TestCase>, String> {
    sqlx::query_as::<_, TestCase>(
        "SELECT id, suite_id, name, description, priority, created_at, updated_at FROM test_cases WHERE suite_id = ? ORDER BY created_at DESC",
    )
    .bind(&suite_id)
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_case(
    pool: tauri::State<'_, DbPool>,
    id: String,
    name: String,
    description: String,
    priority: String,
) -> Result<TestCase, String> {
    let now = Utc::now().to_rfc3339();

    sqlx::query(
        "UPDATE test_cases SET name = ?, description = ?, priority = ?, updated_at = ? WHERE id = ?",
    )
    .bind(&name)
    .bind(&description)
    .bind(&priority)
    .bind(&now)
    .bind(&id)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    sqlx::query_as::<_, TestCase>(
        "SELECT id, suite_id, name, description, priority, created_at, updated_at FROM test_cases WHERE id = ?",
    )
    .bind(&id)
    .fetch_one(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_case(pool: tauri::State<'_, DbPool>, id: String) -> Result<(), String> {
    sqlx::query("DELETE FROM test_cases WHERE id = ?")
        .bind(&id)
        .execute(pool.inner())
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}
