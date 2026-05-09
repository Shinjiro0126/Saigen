use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, Clone)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, Clone)]
pub struct TestSuite {
    pub id: String,
    pub project_id: String,
    pub name: String,
    pub description: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, Clone)]
pub struct TestCase {
    pub id: String,
    pub suite_id: String,
    pub name: String,
    pub description: String,
    pub priority: String,
    pub url: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, Clone)]
pub struct TestRun {
    pub id: String,
    pub case_id: String,
    pub status: String,
    pub started_at: String,
    pub ended_at: Option<String>,
    pub notes: String,
    pub ops_path: Option<String>,
    pub screenshots_dir: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, Clone)]
pub struct TestStep {
    pub id: String,
    pub run_id: String,
    pub step_number: i64,
    pub description: String,
    pub status: String,
    pub screenshot: Option<String>,
    pub created_at: String,
}
