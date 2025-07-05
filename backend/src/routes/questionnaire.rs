use actix_files::NamedFile;
use actix_web::{get, Error};
use actix_session::Session;
use std::env;

use crate::tools::role_check::RoleCheck;

#[get("/questionnaire")]
pub async fn questionnaire_get(session: Session) -> Result<NamedFile, Error> {
    // log::info!("Questionnaire get.");
    if let Err(e) = RoleCheck::check(&session, "student") {
        return Err(e);
    }
    let front_build = format!("{}/questionnaire.html", env::var("STATIC_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}