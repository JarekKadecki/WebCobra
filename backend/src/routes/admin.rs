use actix_files::NamedFile;
use actix_web::{get, Error};
use std::env;


#[get("/admin")]
pub async fn admin_get() -> Result<NamedFile, Error> {
    // log::info!("Admin get.");
    let front_build = format!("{}/admin.html", env::var("STATIC_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}