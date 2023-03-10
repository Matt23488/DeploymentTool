import { getInvokeFn, getListenFn, getOnceFn, RustApiTypes } from './_types';

const plugin = 'tauri-plugin-fs';

type PluginApi = {};
type PluginEvents = {};

type StartingDirectory = 'Input' | 'Output' | { Other: string };

type HiddenPluginApi = {
    browse_directory: RustApiTypes<{ startingDirectory: StartingDirectory }>;
};

type HiddenPluginEvents = {
    directory_selected: string | undefined;
};

export const invoke = getInvokeFn<PluginApi>(plugin);
export const listen = getListenFn<PluginEvents>(plugin);
export const once = getOnceFn<PluginEvents>(plugin);

const hiddenInvoke = getInvokeFn<HiddenPluginApi>(plugin);
const hiddenListen = getListenFn<HiddenPluginEvents>(plugin);
const hiddenOnce = getOnceFn<HiddenPluginEvents>(plugin);

export const browseDirectory = (startingDirectory: StartingDirectory) => new Promise<string | undefined>(resolve => {
    hiddenOnce('directory_selected', event => resolve(event.payload));
    hiddenInvoke('browse_directory', { startingDirectory });
});