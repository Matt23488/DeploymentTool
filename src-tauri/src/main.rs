#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use plugins::{AppsPlugin, SettingsPlugin, FsPlugin};


mod store;
mod plugins;


fn main() {
    tauri::Builder::default()
        .plugin(AppsPlugin::new())
        .plugin(SettingsPlugin::new())
        .plugin(FsPlugin::new())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
