#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]


mod dto;

mod commands;
use commands::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_projects, get_env_vars, new_app, load_app, save_app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
