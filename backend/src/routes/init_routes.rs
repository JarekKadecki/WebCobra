use actix_files::Files;
use actix_web::{web};
use std::env;

use crate::routes::game;
use crate::routes::validate;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    let front_dir = env::var("FRONT_DIR").expect("FRONT_DIR not set");

    cfg.service(Files::new("/assets", format!("{}/assets", front_dir)).prefer_utf8(true));
    cfg.service(game::game);
    cfg.service(game::get_configuration);
    cfg.service(validate::validate_post);
    cfg.route("/validate", web::get().to(validate::validate_get));
    cfg.route("/", web::get().to(validate::validate_get));
}