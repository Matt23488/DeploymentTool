import { getInvokeFn, getListenFn, getOnceFn, RustApiTypes } from './_types';

const plugin = 'tauri-plugin-apps';

export type PublishableApp = {
    id: number;
    name: string;
    deployment_paths: DeploymentPath[];
};

export type DeploymentPath = {
    name: string;
    input_path: string;
    output_path: string;
};

type PluginApi = {
    get_apps: RustApiTypes<{}, PublishableApp[]>;
    new_app: RustApiTypes;
    edit_app: RustApiTypes<{ id: number }>;
    load_app: RustApiTypes<{ id: number | undefined }, PublishableApp>;
    save_app: RustApiTypes<{ app: PublishableApp }, boolean>;
};

type PluginEventApi = {
    refresh_apps: undefined;
};

export const invoke = getInvokeFn<PluginApi>(plugin);
export const listen = getListenFn<PluginEventApi>(plugin);
export const once = getOnceFn<PluginEventApi>(plugin);