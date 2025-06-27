use serde::Deserialize;

#[derive(Deserialize)]
pub struct ValidateRequest {
    pub key: String,
}