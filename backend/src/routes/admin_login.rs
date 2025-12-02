use actix_files::NamedFile;
use actix_web::{post, get, web, HttpResponse, Error};
use actix_session::Session;
use sea_orm::{ DatabaseConnection };
use std::env;
use argon2::{Argon2, PasswordHash, PasswordVerifier};

use crate::models::login_request::LoginRequest;

#[get("/admin/login")]
pub async fn admin_login_get() -> Result<NamedFile, Error> {
    // log::info!("Validate get.");
    let front_build = format!("{}/adminLogin.html", env::var("STATIC_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}


pub async fn validate_credentials(
    login: &str,
    password: &str,
) -> Result<bool, sea_orm::DbErr> {

    let stored_hash = "$argon2id$v=19$m=4096,t=3,p=1$M0JTRGJlemk2cXBEUW8xTA$bqE4vby+VKVQ686dwbMx1A";

    let parsed_hash = match PasswordHash::new(stored_hash) {
        Ok(h) => h,
        Err(_) => return Ok(false),
    };

    let argon2 = Argon2::default();

    let is_valid = argon2.verify_password(password.as_bytes(), &parsed_hash).is_ok();

    Ok(is_valid)
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
    match validate_credentials(login, password).await {
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
            HttpResponse::Ok().finish()

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


