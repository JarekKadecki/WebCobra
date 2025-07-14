use actix_files::NamedFile;
use actix_web::{post, get, web, HttpResponse, Error};
use actix_session::Session;
use sea_orm::{ DatabaseConnection };
use std::env;

use crate::models::login_request::LoginRequest;

#[get("/admin/login")]
pub async fn admin_login_get() -> Result<NamedFile, Error> {
    // log::info!("Validate get.");
    let front_build = format!("{}/adminLogin.html", env::var("STATIC_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}

async fn validate_credentials(db: web::Data<DatabaseConnection>, login: &str, password: &str) -> Result<bool, sea_orm::DbErr> {
    Ok(true)
}

#[post("/api/admin/login")]
async fn validate_admin_login(
    session: Session,
    creds: web::Json<LoginRequest>,
    db: web::Data<DatabaseConnection>,
) -> HttpResponse {
    let login = &creds.login;
    let password = &creds.password;

    // log::info!("Hello from validate.");
    match validate_credentials(db, login, password).await {
        Ok(true) => {
            session.insert("authenticated", true).unwrap_or_else(|e| {
                eprintln!("Session insert error: {:?}", e);
            });
            session.insert("role", "admin").unwrap_or_else(|e| {
                eprintln!("Session insert error: {:?}", e);
            });
            session.insert("login", login).unwrap_or_else(|e| {
                eprintln!("Session insert error: {:?}", e);
            });
            // log::info!("Inserting admin as role.");
            HttpResponse::Ok().finish()
            // HttpResponse::Found()
            //     .append_header(("Location", "/admin"))
            //     .finish()

        }
        Ok(false) => {
            HttpResponse::Unauthorized().body("Invalid key.")
        }
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Internal server error.")
        }
    }
}


