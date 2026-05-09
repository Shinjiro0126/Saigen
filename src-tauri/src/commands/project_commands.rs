use crate::{db::DbPool, models::Project};
use chrono::Utc;
use uuid::Uuid;

#[tauri::command]
pub async fn create_project(
    pool: tauri::State<'_, DbPool>,
    name: String,
    description: String,
) -> Result<Project, String> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    sqlx::query(
        "INSERT INTO projects (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&name)
    .bind(&description)
    .bind(&now)
    .bind(&now)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    Ok(Project {
        id,
        name,
        description,
        created_at: now.clone(),
        updated_at: now,
    })
}

#[tauri::command]
pub async fn list_projects(pool: tauri::State<'_, DbPool>) -> Result<Vec<Project>, String> {
    sqlx::query_as::<_, Project>(
        "SELECT id, name, description, created_at, updated_at FROM projects ORDER BY created_at DESC",
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_project(
    pool: tauri::State<'_, DbPool>,
    id: String,
    name: String,
    description: String,
) -> Result<Project, String> {
    let now = Utc::now().to_rfc3339();

    sqlx::query(
        "UPDATE projects SET name = ?, description = ?, updated_at = ? WHERE id = ?",
    )
    .bind(&name)
    .bind(&description)
    .bind(&now)
    .bind(&id)
    .execute(pool.inner())
    .await
    .map_err(|e| e.to_string())?;

    sqlx::query_as::<_, Project>(
        "SELECT id, name, description, created_at, updated_at FROM projects WHERE id = ?",
    )
    .bind(&id)
    .fetch_one(pool.inner())
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_project(pool: tauri::State<'_, DbPool>, id: String) -> Result<(), String> {
    sqlx::query("DELETE FROM projects WHERE id = ?")
        .bind(&id)
        .execute(pool.inner())
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}
