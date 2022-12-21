use serde::{Serialize, Deserialize};
use std::{fs, path::Path};

const APP_NAME: &str = "rust_deployment_tool";
const STORE_FILE: &str = "app_store.json";

#[derive(Serialize, Deserialize)]
pub struct Store {
    apps: Vec<PublishableApp>,
}

impl Store {
    pub fn load_from_disk() -> Option<Store> {
        let app_data = std::env::vars().find(|(k, _)| k.eq_ignore_ascii_case("LOCALAPPDATA"))?;
        
        let app_data_path = Path::new(app_data.1.as_str()).join(APP_NAME);
        let store_path = app_data_path.join(STORE_FILE);

        if !app_data_path.exists() {
            if let Err(_) = fs::create_dir(&app_data_path) {
                println!("Couldn't create dir {}", app_data_path.to_str().unwrap_or("IDK"));
                return None;
            }
        }

        let store_json = match fs::read_to_string(store_path) {
            Ok(text) => text,
            Err(_) => String::from("{\"apps\":[]}"),
        };

        match serde_json::from_str(store_json.as_str()) {
            Ok(store) => Some(store),
            Err(_) => None
        }
    }
    
    fn save_to_disk(&self) -> bool {
        let app_data = match std::env::vars().find(|(k, _)| k.eq_ignore_ascii_case("LOCALAPPDATA")) {
            Some(app_data) => app_data,
            None => return false,
        };
        
        let app_data_path = Path::new(app_data.1.as_str()).join(APP_NAME);
        let store_path = app_data_path.join(STORE_FILE);

        match serde_json::to_string(self) {
            Ok(json) => {
                match fs::write(store_path, json) {
                    Ok(_) => true,
                    Err(_) => false,
                }
            }
            Err(_) => false,
        }
    }

    pub fn new_app(&self) -> PublishableApp {
        let id = self.apps.iter().map(|a| { a.id }).max().unwrap_or(0) + 1;
        PublishableApp {
            id,
            name: String::new(),
            deployment_paths: vec![],
        }
    }

    pub fn update_app(&mut self, app: PublishableApp) -> bool {
        let store_app = self.apps.iter_mut().enumerate().find(|(_, a)| { a.id() == app.id() });

        if let Some((_, store_app)) = store_app {
            store_app.name = app.name;
            store_app.deployment_paths = app.deployment_paths;
        } else {
            self.apps.push(app);
        }

        self.save_to_disk()
    }

    pub fn apps(&self) -> &Vec<PublishableApp> {
        &self.apps
    }

    pub fn into_apps(self) -> Vec<PublishableApp> {
        self.apps
    }
}

#[derive(Serialize, Deserialize)]
pub struct DeploymentPaths {
    name: String,
    input_path: String,
    output_path: String,
}

#[derive(Serialize, Deserialize)]
pub struct PublishableApp {
    id: u32,
    name: String,
    deployment_paths: Vec<DeploymentPaths>,
}

impl PublishableApp {

    pub fn id(&self) -> &u32 {
        &self.id
    }

    pub fn name(&self) -> &str {
        &self.name
    }
}

#[derive(Serialize, Deserialize)]
pub struct Deployment {
    date: String,
}

#[derive(Serialize, Deserialize)]
pub struct DeploymentInstance {
    year: u32,
    month: u32,
    day: u32,
}