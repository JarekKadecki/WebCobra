use actix_files::NamedFile;
use actix_session::Session;
use actix_web::{get, Error};
use std::env;
use crate::tools::role_check::RoleCheck;

#[get("/game")]
pub async fn game(session: Session) -> Result<NamedFile, Error> {
    RoleCheck::check(&session, "student")?;

    let front_build = format!("{}/game.html", env::var("FRONT_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}