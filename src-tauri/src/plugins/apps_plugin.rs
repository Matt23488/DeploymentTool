use tauri::{
    AppHandle,
    Runtime,
    plugin::Plugin,
    Manager,
    Invoke,
};

use crate::store::{apps_store::{PublishableApp, AppsStore}, load_from_disk, save_to_disk};

pub struct AppsPlugin<R>
where
    R: Runtime
{
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync>,
}

#[tauri::command]
fn get_apps() -> Vec<PublishableApp> {
    match load_from_disk::<AppsStore>() {
        Some(store) => store.into_apps(),
        None => Vec::new(),
    }
}

#[tauri::command]
async fn new_app<R: Runtime>(handle: AppHandle<R>) {
    tauri::WindowBuilder::new(
        &handle,
        "edit_app",
        tauri::WindowUrl::App(std::path::PathBuf::from("edit_app"))
    ).build().unwrap();
}

#[tauri::command]
async fn edit_app<R: Runtime>(id: u32, handle: AppHandle<R>) {
    tauri::WindowBuilder::new(
        &handle,
        "edit_app",
        tauri::WindowUrl::App(std::path::PathBuf::from(format!("edit_app/{id}")))
    ).build().unwrap();
}

#[tauri::command]
fn load_app(id: Option<u32>) -> Option<PublishableApp> {
    let store = load_from_disk::<AppsStore>()?;

    match id {
        Some(id) => store.into_apps().into_iter().find(|app| { app.id() == &id }),
        None => Some(store.new_app()),
    }
}

#[tauri::command]
fn save_app<R: Runtime>(app: PublishableApp, handle: AppHandle<R>) -> bool {
    
    let mut store = match load_from_disk::<AppsStore>() {
        Some(store) => store,
        None => return false,
    };

    store.update_app(app);

    handle.emit_to("app_list", "refresh_apps", ()).unwrap_or_default();
    save_to_disk(&store)
}

impl<R> AppsPlugin<R>
where
    R: Runtime
{
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![get_apps, new_app, edit_app, load_app, save_app]),
        }
    }
}

impl<R> Plugin<R> for AppsPlugin<R>
where
    R: Runtime
{
    fn name(&self) -> &'static str {
        "tauri-plugin-apps"
    }

    fn extend_api(&mut self, invoke: Invoke<R>) {
        (self.invoke_handler)(invoke);
    }
}
