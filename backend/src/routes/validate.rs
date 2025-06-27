use actix_files::NamedFile;
use actix_web::{get, post, web, HttpResponse, Error};
use actix_session::Session;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use std::{env};

use crate::models::validate_request::ValidateRequest;
use crate::models::participations;

#[get("/validate")]
pub async fn validate_get() -> Result<NamedFile, Error> {
    let front_build = format!("{}/validate.html", env::var("FRONT_DIR").expect("Frontend deployment directory not set"));
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

    log::info!("Hello from validate.");
    match validate_key(db, hash).await {
        Ok(true) => {
            session.insert("authenticated", true).unwrap_or_else(|e| {
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


