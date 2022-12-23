#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use plugins::{AppsPlugin, FsPlugin, SettingsPlugin};

mod plugins;
mod store;

fn main() {
    tauri::Builder::default()
        .plugin(AppsPlugin::new())
        .plugin(SettingsPlugin::new())
        .plugin(FsPlugin::new())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
