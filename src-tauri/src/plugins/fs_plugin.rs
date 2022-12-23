use std::path::Path;

use serde::{Deserialize, Serialize};
use tauri::{api::dialog::FileDialogBuilder, plugin::Plugin, Invoke, Manager, Runtime};

use crate::store::{load_from_disk, settings_store::SettingsStore};

use super::PluginEventEmitter;

pub struct FsPlugin<R>
where
    R: Runtime,
{
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync>,
}

#[tauri::command]
fn browse_directory<R: Runtime>(
    starting_directory: StartingDirectory,
    handle: tauri::AppHandle<R>,
    window: tauri::Window<R>,
) {
    let settings = match load_from_disk::<SettingsStore>() {
        Some(settings) => settings,
        _ => return,
    };

    let path = Path::new(match starting_directory {
        StartingDirectory::Input => settings.input_path(),
        StartingDirectory::Output => settings.output_path(),
        StartingDirectory::Other(path) => path,
    });

    FileDialogBuilder::default()
        .set_directory(path)
        .pick_folder(move |path_buf| {
            handle.emit(FsEvent::DirectorySelected {
                window_label: window.label(),
                directory: match path_buf {
                    Some(path) => Some(path.to_string_lossy().to_string()),
                    None => None,
                },
            });
        });
}

impl<R> FsPlugin<R>
where
    R: Runtime,
{
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![browse_directory]),
        }
    }
}

const PLUGIN_NAME: &str = "tauri-plugin-fs";

impl<R> Plugin<R> for FsPlugin<R>
where
    R: Runtime,
{
    fn name(&self) -> &'static str {
        PLUGIN_NAME
    }

    fn extend_api(&mut self, invoke: Invoke<R>) {
        (self.invoke_handler)(invoke);
    }
}

enum FsEvent<'a> {
    DirectorySelected {
        window_label: &'a str,
        directory: Option<String>,
    },
}

impl<'a, R> PluginEventEmitter<FsEvent<'a>> for tauri::AppHandle<R>
where
    R: Runtime,
{
    fn name(&self) -> &'static str {
        PLUGIN_NAME
    }

    fn emit(&self, event: FsEvent) {
        match event {
            FsEvent::DirectorySelected {
                window_label,
                directory,
            } => {
                let event_name =
                    PluginEventEmitter::<FsEvent>::event_name(self, "directory_selected");
                self.emit_to(window_label, event_name.as_str(), directory)
            }
        }
        .unwrap_or_default();
    }
}

#[derive(Serialize, Deserialize)]
enum StartingDirectory<'sd> {
    Input,
    Output,
    Other(&'sd str),
}
