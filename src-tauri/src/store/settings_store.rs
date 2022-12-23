use serde::{Deserialize, Serialize};

use super::Storable;

#[derive(Serialize, Deserialize)]
pub struct SettingsStore {
    input_path: String,
    output_path: String,
}

impl SettingsStore {
    pub fn input_path(&self) -> &str {
        self.input_path.as_str()
    }

    pub fn output_path(&self) -> &str {
        self.output_path.as_str()
    }
}

impl Storable for SettingsStore {
    fn file_name() -> &'static str {
        "settings.json"
    }

    fn default_text() -> &'static str {
        r#"{"input_path":"C:\\","output_path":"C:\\"}"#
    }
}
