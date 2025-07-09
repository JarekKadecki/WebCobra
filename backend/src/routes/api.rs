use actix_web::{web, HttpResponse, post};
use actix_session::Session;
use sea_orm::{EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait, DatabaseConnection};
use serde_json::Value;
use chrono::Utc;

use crate::models::{studies, participations};
use crate::tools::role_check::RoleCheck;

#[post("/api/{action}")]
pub async fn handle_api(
    session: Session,
    db: web::Data<DatabaseConnection>,
    path: web::Path<String>,
    payload: web::Json<Value>,
) -> HttpResponse {
    let action = path.into_inner();
    let data = payload.into_inner();

    match action.as_str() {
        "get_studies" => {
            match studies::Entity::find().all(db.get_ref()).await {
                Ok(studies) => {
                    let names: Result<Vec<String>, _> = studies
                        .into_iter()
                        .map(|s| s.name.ok_or("Missing study name"))
                        .collect();

                    match names {
                        Ok(name_list) => HttpResponse::Ok().json(name_list),
                        Err(_) => HttpResponse::BadRequest().body("Could not fetch study names."),
                    }
                }
                Err(_) => HttpResponse::BadRequest().body("Could not fetch study names."),
            }
        }

        "get_configuration" | "get_questions" => {
            // Get hash from session
            let hash = match session.get::<String>("hash") {
                Ok(Some(h)) => h,
                _ => return HttpResponse::BadRequest().body("Missing or invalid session hash."),
            };

            // Find participation by hash
            let participation = match participations::Entity::find()
                .filter(participations::Column::Hash.eq(hash))
                .one(db.get_ref())
                .await
            {
                Ok(Some(p)) => p,
                _ => return HttpResponse::NotFound().body("Participation not found."),
            };

            // Find related study
            let study = match studies::Entity::find_by_id(participation.study_id.unwrap_or_default())
                .one(db.get_ref())
                .await
            {
                Ok(Some(s)) => s,
                _ => return HttpResponse::NotFound().body("Study not found."),
            };

            let field = if action == "get_configuration" {
                &study.configuration
            } else {
                &study.questions
            };

            match field {
                Some(x) => 
                HttpResponse::Ok().json(serde_json::from_str::<Value>(x).unwrap_or(Value::Null)),
                None => HttpResponse::BadRequest().body("Missing or invalid field passed."),
            }
        }

        "add_study" => {
            let name = Some(data["name"].to_string().to_owned());

            let model = studies::ActiveModel {
                name: Set(name),
                configuration: Set(Some("{}".to_string())),
                questions: Set(Some("{}".to_string())),
                created_at: Set(Some(Utc::now().naive_utc())),
                ..Default::default()
            };

            match model.insert(db.get_ref()).await {
                Ok(_) => HttpResponse::Ok().body("Study added."),
                Err(e) => {
                    eprintln!("Insert error: {:?}", e);
                    HttpResponse::InternalServerError().finish()
                }
            }
        }

        "remove_study" => {
            let name = data["name"].as_str().unwrap_or("");
            let result = studies::Entity::delete_many()
                .filter(studies::Column::Name.eq(name))
                .exec(db.get_ref())
                .await;

            match result {
                Ok(_) => HttpResponse::Ok().body("Study removed."),
                Err(e) => {
                    eprintln!("Delete error: {:?}", e);
                    HttpResponse::InternalServerError().finish()
                }
            }
        }

        "generate_keys" => {
            let study_name = data["study"].as_str().unwrap_or("");
            let count = data["number"].as_u64().unwrap_or(0) as usize;

            let study = match studies::Entity::find()
                .filter(studies::Column::Name.eq(study_name))
                .one(db.get_ref())
                .await
            {
                Ok(Some(s)) => s,
                _ => return HttpResponse::NotFound().body("Study not found."),
            };

            for _ in 0..count {
                let hash = uuid::Uuid::new_v4().to_string();
                let participation = participations::ActiveModel {
                    study_id: Set(Some(study.id)),
                    hash: Set(Some(hash)),
                    date: Set(Some(Utc::now().naive_utc())),
                    ..Default::default()
                };
                let _ = participation.insert(db.get_ref()).await;
            }

            HttpResponse::Ok().body("Keys generated.")
        }

        "submit_results" | "submit_answers" => {
            if let Err(e) = RoleCheck::check(&session, "student") {
                return e.error_response();
            }

            let hash = match session.get::<String>("hash") {
                Ok(Some(h)) => h,
                _ => return HttpResponse::BadRequest().body("Invalid session hash."),
            };

            let participation = match participations::Entity::find()
                .filter(participations::Column::Hash.eq(&hash))
                .one(db.get_ref())
                .await
            {
                Ok(Some(p)) => p,
                _ => return HttpResponse::NotFound().body("Participation not found."),
            };

            let mut active_model: participations::ActiveModel = participation.into();

            if action == "submit_results" {
                active_model.stats = Set(Some(data.to_string()));
                active_model.finished = Set(Some(true));
            } else {
                active_model.answers = Set(Some(data.to_string()));
            }

            match active_model.update(db.get_ref()).await {
                Ok(_) => HttpResponse::Ok().body("Update successful."),
                Err(e) => {
                    eprintln!("Update error: {:?}", e);
                    HttpResponse::InternalServerError().finish()
                }
            }
        }

        _ => HttpResponse::NotFound().body("Unknown action."),
    }
}
