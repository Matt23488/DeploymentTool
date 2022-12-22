import { EventCallback, listen } from '@tauri-apps/api/event';

type RustEventApi = {
    refresh_apps: {};
};
type RustEvents = keyof RustEventApi;

export const listenRust = <T extends RustEvents>(event: T, callback: EventCallback<RustEventApi[T]>) => listen(event, callback);