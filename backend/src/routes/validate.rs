use actix_files::NamedFile;
use actix_web::{post, web, HttpResponse, Error};
use actix_session::Session;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use std::env;

use crate::models::validate_request::ValidateRequest;
use crate::models::{participations};

pub async fn validate_get() -> Result<NamedFile, Error> {
    // log::info!("Validate get.");
    let front_build = format!("{}/validate.html", env::var("STATIC_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}

async fn validate_key(db: web::Data<DatabaseConnection>, hash: &str) -> Result<bool, sea_orm::DbErr> {
    let result = participations::Entity::find()
        .filter(participations::Column::Hash.eq(hash))
        .one(db.get_ref())
        .await?;

    Ok(result.is_some())
}

#[post("/api/validate")]
async fn validate_post(
    session: Session,
    creds: web::Json<ValidateRequest>,
    db: web::Data<DatabaseConnection>,
) -> HttpResponse {
    let hash = &creds.key;

    // log::info!("Hello from validate.");
    match validate_key(db, hash).await {
        Ok(true) => {
            session.insert("authenticated", true).unwrap_or_else(|e| {
                eprintln!("Session insert error: {:?}", e);
            });
            session.insert("role", "student").unwrap_or_else(|e| {
                eprintln!("Session insert error: {:?}", e);
            });
            session.insert("hash", hash).unwrap_or_else(|e| {
                eprintln!("Session insert error: {:?}", e);
            });
            // log::info!("Inserting student as role.");
            HttpResponse::Ok().finish()
            // HttpResponse::Found()
            //     .append_header(("Location", "/game"))
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


