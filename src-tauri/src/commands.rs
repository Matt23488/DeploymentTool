use tauri::Manager;

use crate::{
    dto::{
        PublishableApp,
        AppsStore
    },
    store::{
        load_from_disk,
        save_to_disk
    }
};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn get_apps() -> Vec<PublishableApp> {
    match load_from_disk::<AppsStore>() {
        Some(store) => store.into_apps(),
        None => Vec::new(),
    }
}

#[tauri::command]
pub fn get_env_vars() -> Vec<(String, String)> {
    std::env::vars().collect()
}

#[tauri::command]
pub async fn new_app(handle: tauri::AppHandle) {
    tauri::WindowBuilder::new(
        &handle,
        "new_app",
        tauri::WindowUrl::App(std::path::PathBuf::from("edit_app"))
    ).build().unwrap();
}

#[tauri::command]
pub fn load_app(id: Option<u32>) -> Option<PublishableApp> {
    let store = load_from_disk::<AppsStore>()?;

    match id {
        Some(id) => store.into_apps().into_iter().find(|app| { app.id() == &id }),
        None => Some(store.new_app()),
    }
}

#[tauri::command]
pub fn save_app(app: PublishableApp, handle: tauri::AppHandle) -> bool {
    
    let mut store = match load_from_disk::<AppsStore>() {
        Some(store) => store,
        None => return false,
    };

    store.update_app(app);

    handle.emit_to("app_list", "refresh_apps", ()).unwrap_or_default();
    save_to_disk(&store)
}