use serde::{Serialize, Deserialize};

use super::Storable;

#[derive(Serialize, Deserialize)]
pub struct AppsStore {
    apps: Vec<PublishableApp>,
}

impl Storable for AppsStore {
    fn file_name() -> &'static str {
        "app_store.json"
    }

    fn default_text() -> &'static str {
        r#"{"apps":[]}"#
    }
}

impl AppsStore {
    pub fn new_app(&self) -> PublishableApp {
        let id = self.apps.iter().map(|a| { a.id }).max().unwrap_or(0) + 1;
        PublishableApp {
            id,
            name: String::new(),
            deployment_paths: vec![],
        }
    }

    pub fn update_app(&mut self, app: PublishableApp) {
        let existing_index = self.apps.iter_mut()
            .enumerate()
            .find(|(_, a)| { a.id == app.id })
            .map(|(index, _)| index);

        match existing_index {
            Some(index) => self.apps[index] = app,
            None => self.apps.push(app),
        }
    }

    // pub fn apps(&self) -> &Vec<PublishableApp> {
    //     &self.apps
    // }

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

    // pub fn name(&self) -> &str {
    //     &self.name
    // }
}

#[derive(Serialize, Deserialize)]
pub struct Deployment {
    instance: DeploymentInstance,
}

#[derive(Serialize, Deserialize)]
pub struct DeploymentInstance {
    year: u32,
    month: u32,
    day: u32,
}