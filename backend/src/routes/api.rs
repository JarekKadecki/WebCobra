use actix_web::{web, HttpResponse, post};
use actix_session::Session;
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder, QuerySelect, Set};
use serde_json::Value;
use chrono::Utc;

use crate::models::{studies, participations};
use crate::tools::is_valid_json::is_valid_json;
use crate::tools::role_check::{self, RoleCheck};

#[post("/api/{action}")]
pub async fn handle_api(
    session: Session,
    db: web::Data<DatabaseConnection>,
    path: web::Path<String>,
    payload: web::Json<Value>,
) -> HttpResponse {
    let action = path.into_inner();
    let data = payload.into_inner();

    log::info!("Request to post:api/{}", action);

    match action.as_str() {
        "get_studies" => {
            
            if let Err(e) = RoleCheck::check(&session, "admin") {
                return e.error_response();
            }

            match studies::Entity::find()
                .select_only()
                .column(studies::Column::Name)
                .into_tuple::<Option<String>>()
                .all(db.get_ref())
                .await
            {
                Ok(names) => {
                    let name_list: Vec<String> = names.into_iter().flatten().collect();
                    log::info!("Collected study names: {:?}", name_list);
                    HttpResponse::Ok().json(name_list)
                },
                Err(_) => HttpResponse::BadRequest().body("Could not fetch study names."),
            }
        }

        "get_configuration" | "get_questions" => {
            let role = session.get::<String>("role").unwrap_or(None);

            let study = if role == Some("student".to_string()) {
                let hash = match session.get::<String>("hash") {
                    Ok(Some(h)) => h,
                    _ => return HttpResponse::BadRequest().body("Missing or invalid session hash."),
                };

                let participation = match participations::Entity::find()
                    .filter(participations::Column::Hash.eq(hash))
                    .one(db.get_ref())
                    .await
                {
                    Ok(Some(p)) => p,
                    _ => return HttpResponse::NotFound().body("Participation not found."),
                };

                match studies::Entity::find_by_id(participation.study_id.unwrap_or_default())
                    .one(db.get_ref())
                    .await
                {
                    Ok(Some(s)) => s,
                    _ => return HttpResponse::NotFound().body("Study not found."),
                }
            } else if role == Some("admin".to_string()) {
                let study_name = data["study"].as_str().unwrap_or("").to_string();
                match studies::Entity::find()
                    .filter(studies::Column::Name.eq(study_name))
                    .one(db.get_ref())
                    .await
                {
                    Ok(Some(s)) => s,
                    _ => return HttpResponse::NotFound().body("Study not found."),
                }
            } else {
                return HttpResponse::BadRequest().body("Unauthorized.");
            };

            let field = if action == "get_configuration" {
                log::info!("Returning configuration: {:?} of {:?}", &study.configuration, study.name);
                &study.configuration
            } else {
                log::info!("Returning questions: {:?} of {:?}", &study.questions, study.name);
                &study.questions
            };

            match field {
                Some(x) => HttpResponse::Ok().json(serde_json::from_str::<Value>(x).unwrap_or(Value::Null)),
                None => HttpResponse::BadRequest().body("Missing or invalid field passed."),
            }
        }

        "set_questions" | "set_configuration" => {
            if let Err(e) = RoleCheck::check(&session, "admin") {
                return e.error_response();
            }

            let field = data["fieldToUpdate"].as_str().unwrap_or("");
            let study_name = data["study"].as_str().unwrap_or("");
            let value = data["value"].as_str().unwrap_or("{}");

            if(is_valid_json(value) == false) {
                return HttpResponse::BadRequest().body("Invalid JSON provided.")
            }

            let study = match studies::Entity::find()
                .filter(studies::Column::Name.eq(study_name))
                .one(db.get_ref())
                .await
            {
                Ok(Some(s)) => s,
                _ => return HttpResponse::NotFound().body("Study not found."),
            };

            let mut active_model: studies::ActiveModel = study.into();

            match field {
                "questions" => active_model.questions = Set(Some(value.to_string())),
                "configuration" => active_model.configuration = Set(Some(value.to_string())),
                _ => return HttpResponse::BadRequest().body("Invalid fieldToUpdate value."),
            }

            match active_model.update(db.get_ref()).await {
                Ok(_) => HttpResponse::Ok().body("Study updated."),
                Err(e) => {
                    eprintln!("Update error: {:?}", e);
                    HttpResponse::InternalServerError().finish()
                }
            }
        }

        
        "add_study" => {

            if let Err(e) = RoleCheck::check(&session, "student") {
                return e.error_response();
            }

            let name = Some(data["study"].as_str().unwrap_or("").to_string());

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

            if let Err(e) = RoleCheck::check(&session, "student") {
                return e.error_response();
            }

            let name = data["study"].as_str().unwrap_or("");
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

            if let Err(e) = RoleCheck::check(&session, "student") {
                return e.error_response();
            }

            let study_name = data["study"].as_str().unwrap_or("");
            let count = data["number"].as_u64().unwrap_or(0) as usize;

            log::info!("Generating {:?} participations for {:?}.", count, study_name);

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

                if let Err(e) = participation.insert(db.get_ref()).await {
                    eprintln!("Failed to insert participation: {:?}", e);
                }

            }

            HttpResponse::Ok().body("Keys generated.")
        }

        "get_keys" => {

            if let Err(e) = RoleCheck::check(&session, "student") {
                return e.error_response();
            }
            
            let study_name = data["study"].as_str().unwrap_or("");
            let count = data["number"].as_u64().unwrap_or(0) as usize;

            log::info!("Returning {:?} participations for {:?}.", count, study_name);

            let study = match studies::Entity::find()
                .filter(studies::Column::Name.eq(study_name))
                .one(db.get_ref())
                .await
            {
                Ok(Some(s)) => s,
                _ => return HttpResponse::NotFound().body("Study not found."),
            };

            let participations_list = match participations::Entity::find()
                .filter(participations::Column::StudyId.eq(Some(study.id)))
                .order_by_desc(participations::Column::Date)
                .limit(count as u64)
                .all(db.get_ref())
                .await
            {
                Ok(list) => list,
                Err(e) => {
                    eprintln!("Fetch keys error: {:?}", e);
                    return HttpResponse::InternalServerError().finish();
                }
            };

            let hashes: Vec<String> = participations_list
                .into_iter()
                .filter_map(|p| p.hash)
                .collect();

            HttpResponse::Ok().json(hashes)
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
