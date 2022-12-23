use serde::{Deserialize, Serialize};

use super::Storable;

#[derive(Serialize, Deserialize)]
pub struct SettingsStore {
    input_path: String,
    output_path: String,
}

impl Storable for SettingsStore {
    fn file_name() -> &'static str {
        "settings.json"
    }

    fn default_text() -> &'static str {
        r#"{"input_path":"C:\\","output_path":"C:\\"}"#
    }
}
