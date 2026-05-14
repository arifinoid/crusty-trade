use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite};

pub async fn init_db() -> Result<Pool<Sqlite>, sqlx::Error> {
    let database_url = "sqlite:crusty_trade.db";
    
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await?;

    // Create tables if they don't exist
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS trade_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            side TEXT NOT NULL,
            quantity REAL NOT NULL,
            entry_price REAL NOT NULL,
            exit_price REAL,
            pnl REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )"
    ).execute(&pool).await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS presets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            leverage INTEGER NOT NULL,
            stop_loss_pct REAL NOT NULL,
            take_profit_ratio REAL NOT NULL
        )"
    ).execute(&pool).await?;

    Ok(pool)
}
