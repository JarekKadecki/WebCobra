use sea_orm::{Database, DatabaseConnection};
use sea_orm_migration::MigratorTrait;
use migration::Migrator;

#[tokio::main]
async fn main() {
    // Load environment variables from a .env file
    dotenvy::from_filename("../backend/.env").ok();

    // Get the database URL from environment variables
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file or environment variables.");

    // Connect to the database
    let db: DatabaseConnection = Database::connect(&database_url)
        .await
        .expect("Database connection failed.");

    // Run the migrations
    match Migrator::up(&db, None).await {
        Ok(()) => println!("Migrations applied successfully!"),
        Err(e) => {
            eprintln!("Migration failed: {}", e);
            std::process::exit(1);
        }
    }
}