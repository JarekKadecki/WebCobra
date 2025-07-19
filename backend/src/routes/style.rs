use actix_files::NamedFile;
use actix_web::{get, Error};
use std::env;

#[get("style.css")]
pub async fn style_get() -> Result<NamedFile, Error> {
    // log::info!("Validate get.");
    let front_build = format!("{}/style.css", env::var("FRONT_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}