import { getInvokeFn, RustApiTypes } from './_types';

const plugin = 'tauri-plugin-settings';

export type SettingsStore = {
    input_path: string;
    output_path: string;
};

type PluginApi = {
    open_settings: RustApiTypes;
    load_settings: RustApiTypes<{}, SettingsStore>;
    save_settings: RustApiTypes<{ store: SettingsStore }, boolean>;
};

export const invoke = getInvokeFn<PluginApi>(plugin);