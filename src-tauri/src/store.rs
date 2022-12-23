use std::{
    fs,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};

pub mod apps_store;
pub mod settings_store;

const APP_NAME: &str = "rust_deployment_tool";
const APP_DATA_PATH: &str = "LOCALAPPDATA";
pub trait Storable {
    fn file_name() -> &'static str;
    fn default_text() -> &'static str;
}

pub fn load_from_disk<T>() -> Option<T>
where
    for<'de> T: Serialize + Deserialize<'de> + Storable,
{
    let store_path = match get_store_path(T::file_name()) {
        Some(path) => path,
        None => return None,
    };

    let store_json = match fs::read_to_string(store_path) {
        Ok(text) => text,
        Err(_) => String::from(T::default_text()),
    };

    match serde_json::from_str(store_json.as_str()) {
        Ok(store) => Some(store),
        Err(_) => None,
    }
}

pub fn save_to_disk<'de, T>(store: &'de T) -> bool
where
    T: Serialize + Deserialize<'de> + Storable,
{
    let store_path = match get_store_path(T::file_name()) {
        Some(path) => path,
        None => return false,
    };

    match serde_json::to_string(store) {
        Ok(json) => fs::write(store_path, json).is_ok(),
        Err(_) => false,
    }
}

fn get_store_path(file_name: &str) -> Option<PathBuf> {
    let app_data = match std::env::vars()
        .find(|(k, _)| k.eq_ignore_ascii_case(APP_DATA_PATH))
        .map(|(_, v)| v)
    {
        Some(app_data) => app_data,
        None => return None,
    };

    let app_data_path = Path::new(app_data.as_str()).join(APP_NAME);

    if !app_data_path.exists() {
        if let Err(_) = fs::create_dir(&app_data_path) {
            println!(
                "Couldn't create dir {}",
                app_data_path.to_str().unwrap_or("IDK")
            );
            return None;
        }
    }

    Some(app_data_path.join(file_name))
}
