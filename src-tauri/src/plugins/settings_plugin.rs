use tauri::{
    AppHandle,
    Runtime,
    plugin::Plugin,
    Invoke,
};

use crate::store::{settings_store::SettingsStore, load_from_disk, save_to_disk};

pub struct SettingsPlugin<R>
where
    R: Runtime
{
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync>,
}

#[tauri::command]
pub async fn open_settings<R: Runtime>(handle: AppHandle<R>) {
    tauri::WindowBuilder::new(
        &handle,
        "settings",
        tauri::WindowUrl::App(std::path::PathBuf::from("settings"))
    ).build().unwrap();
}

#[tauri::command]
pub fn load_settings() -> SettingsStore {
    load_from_disk::<SettingsStore>().unwrap()
}

#[tauri::command]
pub fn save_settings(store: SettingsStore) -> bool {
    save_to_disk(&store)
}

impl<R> SettingsPlugin<R>
where
    R: Runtime
{
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![open_settings, load_settings, save_settings]),
        }
    }
}

impl<R> Plugin<R> for SettingsPlugin<R>
where
    R: Runtime
{
    fn name(&self) -> &'static str {
        "tauri-plugin-settings"
    }

    fn extend_api(&mut self, invoke: Invoke<R>) {
        (self.invoke_handler)(invoke);
    }
}
