pub mod apps_plugin;
pub mod settings_plugin;

pub trait PluginEventEmitter<T> {
    fn emit(&self, event: T);
}