use serde_json::Value;

pub fn is_valid_json(input: &str) -> bool {
    serde_json::from_str::<Value>(input).is_ok()
}

pub fn validate_results_data(data: &serde_json::Value) -> Result<(), String> {
    let required_fields = [
        "roundApplesSteal",
        "roundScore",
        "roundOutcome",
        "roundBoost",
        "playerPosition",
    ];

    for field in &required_fields {
        if !data.get(*field).map_or(false, |v| v.is_array()) {
            return Err(format!("Missing or invalid field: {}", field));
        }
    }

    Ok(())
}
