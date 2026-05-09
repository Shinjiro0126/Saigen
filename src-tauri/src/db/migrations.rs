use sqlx::{Pool, Sqlite};

pub async fn run(pool: &Pool<Sqlite>) -> Result<(), sqlx::Error> {
    sqlx::query("PRAGMA journal_mode=WAL").execute(pool).await?;
    sqlx::query("PRAGMA foreign_keys=ON").execute(pool).await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS projects (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            created_at  TEXT NOT NULL,
            updated_at  TEXT NOT NULL
        )",
    )
    .execute(pool)
    .await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS test_suites (
            id          TEXT PRIMARY KEY,
            project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            name        TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            created_at  TEXT NOT NULL,
            updated_at  TEXT NOT NULL
        )",
    )
    .execute(pool)
    .await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS test_cases (
            id          TEXT PRIMARY KEY,
            suite_id    TEXT NOT NULL REFERENCES test_suites(id) ON DELETE CASCADE,
            name        TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            priority    TEXT NOT NULL DEFAULT 'medium',
            url         TEXT NOT NULL DEFAULT '',
            created_at  TEXT NOT NULL,
            updated_at  TEXT NOT NULL
        )",
    )
    .execute(pool)
    .await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS test_runs (
            id              TEXT PRIMARY KEY,
            case_id         TEXT NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
            status          TEXT NOT NULL DEFAULT 'running',
            started_at      TEXT NOT NULL,
            ended_at        TEXT,
            notes           TEXT NOT NULL DEFAULT '',
            ops_path        TEXT,
            screenshots_dir TEXT
        )",
    )
    .execute(pool)
    .await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS test_steps (
            id           TEXT PRIMARY KEY,
            run_id       TEXT NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
            step_number  INTEGER NOT NULL,
            description  TEXT NOT NULL,
            status       TEXT NOT NULL DEFAULT 'pending',
            screenshot   TEXT,
            created_at   TEXT NOT NULL
        )",
    )
    .execute(pool)
    .await?;

    sqlx::query(
        "CREATE INDEX IF NOT EXISTS idx_suites_project ON test_suites(project_id)",
    )
    .execute(pool)
    .await?;
    sqlx::query(
        "CREATE INDEX IF NOT EXISTS idx_cases_suite ON test_cases(suite_id)",
    )
    .execute(pool)
    .await?;
    sqlx::query(
        "CREATE INDEX IF NOT EXISTS idx_runs_case ON test_runs(case_id)",
    )
    .execute(pool)
    .await?;
    sqlx::query(
        "CREATE INDEX IF NOT EXISTS idx_steps_run ON test_steps(run_id, step_number)",
    )
    .execute(pool)
    .await?;

    Ok(())
}
