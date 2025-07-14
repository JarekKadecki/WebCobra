use actix_files::Files;
use actix_web::{web};
use std::env;

use crate::routes::admin;
use crate::routes::admin_login;
use crate::routes::api;
use crate::routes::game;
use crate::routes::questionnaire;
use crate::routes::validate;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    let front_dir = env::var("FRONT_DIR").expect("FRONT_DIR not set");

    cfg.service(Files::new("/assets", format!("{}/assets", front_dir)).prefer_utf8(true));
    cfg.service(game::game);
    // cfg.service(game::get_configuration);
    cfg.service(questionnaire::questionnaire_get);
    cfg.service(admin::admin_get);
    cfg.service(admin_login::admin_login_get);
    cfg.service(admin_login::validate_admin_login);
    cfg.route("/validate", web::get().to(validate::validate_get));
    cfg.route("/", web::get().to(validate::validate_get));
    cfg.service(validate::validate_post);
    cfg.service(api::handle_api);
}