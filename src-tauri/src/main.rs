#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]


mod store;
mod plugins;

use plugins::{apps_plugin::AppsPlugin, settings_plugin::SettingsPlugin};

// use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};


fn main() {
    // let open_settings = CustomMenuItem::new(String::from("settings"), "Settings");
    // let file_menu = Submenu::new("File", Menu::new().add_item(open_settings));
    // let menu = Menu::new()
    //     .add_submenu(file_menu)
    //     .add_native_item(MenuItem::Separator)
    //     .add_native_item(MenuItem::Quit);

    tauri::Builder::default()
        // .menu(menu)
        .plugin(AppsPlugin::new())
        .plugin(SettingsPlugin::new())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
