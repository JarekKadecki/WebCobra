use actix_session::Session;
use actix_web::{Error, HttpResponse, error::InternalError, http::header};

pub struct RoleCheck;

impl RoleCheck {
    pub fn check(session: &Session, required: &'static str) -> Result<(), Error> {
        let is_authenticated = session.get::<bool>("authenticated")
            .unwrap_or(Some(false))
            .unwrap_or(false);

        let role = session.get::<String>("role").unwrap_or(None);

        match (is_authenticated, role.as_deref()) {
            (true, Some(role)) if role == required => Ok(()),
            _ => {
                let response = HttpResponse::TemporaryRedirect()
                    .insert_header((header::LOCATION, "/"))
                    .finish();

                Err(InternalError::from_response("Redirecting", response).into())
            }
        }
    }
}
