pub mod apps_plugin;
pub mod fs_plugin;
pub mod settings_plugin;

pub use apps_plugin::AppsPlugin;
pub use fs_plugin::FsPlugin;
pub use settings_plugin::SettingsPlugin;

pub trait PluginEventEmitter<T> {
    fn emit(&self, event: T);
    fn name(&self) -> &'static str;
    fn event_name(&self, short_name: &'static str) -> String {
        format!("plugin:{}__{}", self.name(), short_name)
    }
}
