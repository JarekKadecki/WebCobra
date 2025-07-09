use actix_files::NamedFile;
use actix_session::Session;
use actix_web::{get, post, web, Error, HttpResponse};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter, Set};
use serde_json::Value;
use std::env;

use crate::models::participations;
use crate::tools::get_configuration::get_configuration_by_hash;
use crate::tools::role_check::RoleCheck;

// #[get("/api/get_configuration")]
// async fn get_configuration(session: Session, db: web::Data<DatabaseConnection>) -> HttpResponse {
//     if let Err(e) = RoleCheck::check(&session, "student") {
//         return e.error_response()
//     }


//     let hash = match session.get::<String>("hash") {
//         Ok(Some(h)) => h,
//         _ => return HttpResponse::BadRequest().body("The session supplied with invalid hash."),
//     };
//     log::info!("Hello from get_conf.");
//     match get_configuration_by_hash(&db, &hash).await {
//         Ok(Some(config)) => 
//         {
//             log::info!("conf retrived");
//             HttpResponse::Ok().json(config)
//         },
//         Ok(None) => HttpResponse::NotFound().body("No configuration found."),
//         Err(e) => {
//             eprintln!("Database error: {:?}", e);
//             HttpResponse::InternalServerError().finish()
//         }
//     }
// }


// #[post("/api/submit_results")]
// async fn submit_results(
//     session: Session,
//     db: web::Data<DatabaseConnection>,
//     payload: web::Json<Value>,
// ) -> HttpResponse {
//     if let Err(e) = RoleCheck::check(&session, "student") {
//         return e.error_response();
//     }

//     let hash = match session.get::<String>("hash") {
//         Ok(Some(h)) => h,
//         _ => return HttpResponse::BadRequest().body("The session supplied with invalid hash."),
//     };

//     let participation = participations::Entity::find()
//         .filter(participations::Column::Hash.eq(&hash))
//         .one(db.get_ref())
//         .await;

//     match participation {
//         Ok(Some(model)) => {
//             let mut active_model: participations::ActiveModel = model.into_active_model();

//             active_model.stats = Set(Some(payload.to_string()));
//             active_model.finished = Set(Some(true));

//             match active_model.update(db.get_ref()).await {
//                 Ok(_) => HttpResponse::Ok().body("Results saved."),
//                 Err(e) => {
//                     eprintln!("Database error: {:?}", e);
//                     HttpResponse::InternalServerError().body("Failed to update results.")
//                 }
//             }
//         }
//         Ok(None) => HttpResponse::NotFound().body("Participation not found."),
//         Err(e) => {
//             eprintln!("DB error: {:?}", e);
//             HttpResponse::InternalServerError().body("DB query failed.")
//         }
//     }
// }

#[get("/game")]
pub async fn game(session: Session) -> Result<NamedFile, Error> {
    RoleCheck::check(&session, "student")?;

    let front_build = format!("{}/index.html", env::var("FRONT_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}