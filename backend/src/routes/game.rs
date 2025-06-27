use actix_files::NamedFile;
use actix_web::{get, Error};
use std::env;

#[get("/game")]
pub async fn game() -> Result<NamedFile, Error> {
    let front_build = format!("{}/game.html", env::var("FRONT_DIR").expect("Frontend deployment directory not set"));
    Ok(actix_files::NamedFile::open_async(front_build).await?)
}