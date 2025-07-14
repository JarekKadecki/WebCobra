use actix_files::NamedFile;
use actix_session::Session;
use actix_web::{get, Error};
use std::env;

use crate::tools::role_check::RoleCheck;


#[get("/admin")]
pub async fn admin_get(session: Session) -> Result<NamedFile, Error> {
    // log::info!("Admin get.");
    if let Err(e) = RoleCheck::check(&session, "admin") {
        return Err(e);
    }
    let front_build = format!("{}/admin.html", env::var("STATIC_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}