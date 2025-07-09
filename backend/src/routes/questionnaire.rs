use actix_files::NamedFile;
use actix_web::{get, post, web, Error, HttpResponse};
use actix_session::Session;
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter, Set};
use serde_json::Value;
use std::env;

use crate::{models::participations, tools::role_check::RoleCheck};

#[get("/questionnaire")]
pub async fn questionnaire_get(session: Session) -> Result<NamedFile, Error> {
    // log::info!("Questionnaire get.");
    if let Err(e) = RoleCheck::check(&session, "student") {
        return Err(e);
    }
    let front_build = format!("{}/questionnaire.html", env::var("STATIC_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}

// #[post("/api/submit_answers")]
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

//             active_model.answers = Set(Some(payload.to_string()));

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