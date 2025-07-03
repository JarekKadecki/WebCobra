
extern crate log;

use actix_web::{cookie::Key, web, App, HttpServer};
use actix_session::{SessionMiddleware, storage::CookieSessionStore};
use dotenvy::dotenv;
use log::info;
use sea_orm::Database;
use std::env;

mod models;
mod routes;
mod tools;


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    let host = env::var("HOST").expect("Host not set");
    let port = env::var("PORT").expect("Port not set");
    let key = Key::generate();
    let db_str = env::var("DATABASE").expect("Database connection string not set");
    let db_conn = Database::connect(db_str)
        .await
        .expect("Could not connect to database");

    info!("Hello from main.");

    HttpServer::new(move ||{
        App::new()
            .app_data(web::Data::new(db_conn.clone()))
            .wrap(SessionMiddleware::new(
                CookieSessionStore::default(),
                key.clone()
            ))
            .configure(routes::init_routes)
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await
}


// to do
//     main.rs: napisac jakis server
//     models: wygenerowac modele
//     routes: tudaj dodac obslugę różnych routów
//     database: jakas sprytna obsluga bazy danych
//     - gzdies wstawic jakies mechanizmy logowania
//     - gdzies wstawic jakies customowe errory i waningi