import { getInvokeFn, getListenFn, getOnceFn, RustApiTypes } from './_types';

const plugin = 'tauri-plugin-fs';

type PluginApi = {
    browse_directory: RustApiTypes;
};

export type PathType = 'input' | 'output';

type PluginEvents = {
    directory_selected: string | undefined;
};

export const invoke = getInvokeFn<PluginApi>(plugin);
export const listen = getListenFn<PluginEvents>(plugin);
export const once = getOnceFn<PluginEvents>(plugin);