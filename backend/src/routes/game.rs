use actix_files::NamedFile;
use actix_session::Session;
use actix_web::{get, post, Error, web, HttpResponse};
use std::env;
use sea_orm::{DatabaseConnection};

use crate::tools::role_check::RoleCheck;
use crate::tools::get_configuration::get_configuration_by_hash;

#[post("/api/get_configuration")]
async fn get_configuration(session: Session, db: web::Data<DatabaseConnection>) -> HttpResponse {
    let hash = match session.get::<String>("hash") {
        Ok(Some(h)) => h,
        _ => return HttpResponse::BadRequest().body("The session supplied with invalid hash."),
    };
    log::info!("Hello from get_conf.");
    match get_configuration_by_hash(&db, &hash).await {
        Ok(Some(config)) => 
        {
            log::info!("conf retrived");
            HttpResponse::Ok().json(config)
        },
        Ok(None) => HttpResponse::NotFound().body("No configuration found."),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}


#[get("/game")]
pub async fn game(session: Session) -> Result<NamedFile, Error> {
    RoleCheck::check(&session, "student")?;

    let front_build = format!("{}/game.html", env::var("FRONT_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}