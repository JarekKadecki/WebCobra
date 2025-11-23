use serde_json::{Value, json};

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
pub fn validate_finish_game_data(data: &Value) -> Result<(), String> {
    if !data.is_object() {
        return Err("Payload must be an object".into());
    }

    let stats = data.get("stats")
        .ok_or("Missing field: stats")?;

    if !stats.is_object() {
        return Err("stats must be an object".into());
    }

    // required stats keys
    let required_stats = [
        "roundApplesSteal",
        "roundScore",
        "roundOutcome",
        "roundBoost",
        "playerPosition",
    ];

    for key in required_stats {
        if !stats.get(key).is_some() {
            return Err(format!("Missing stats field: {}", key));
        }
    }

    // answers
    let answers = data.get("answers")
        .ok_or("Missing field: answers")?;

    if !answers.is_object() {
        return Err("answers must be an object".into());
    }

    Ok(())
}

pub fn flatten_answers_array(value: &Value) -> Value {
    // Expect: array of objects
    let arr = match value.as_array() {
        Some(a) => a,
        None => return json!({}),
    };

    let mut flat = serde_json::Map::new();

    for (i, obj) in arr.iter().enumerate() {
        if let Some(map) = obj.as_object() {
            for (question_id, answer) in map {
                let key = format!("{}_{}", question_id, i); 
                flat.insert(key, answer.clone());
            }
        }
    }

    Value::Object(flat)
}


