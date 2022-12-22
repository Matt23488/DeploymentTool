import { invoke } from '@tauri-apps/api';
import { EventCallback, listen } from '@tauri-apps/api/event';
import Utils from './Utils';

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

type RustApiTypes<Args extends {}, Return = void> = {
    args: Args;
    return: Return;
}

type RustApi = {
    greet: RustApiTypes<{ name: string }, string>;
    get_apps: RustApiTypes<{}, PublishableApp[]>;
    get_env_vars: RustApiTypes<{}, [string, string][]>;
    new_app: RustApiTypes<{}>;
    load_app: RustApiTypes<{ id: number | undefined }, PublishableApp>;
    save_app: RustApiTypes<{ app: PublishableApp }, boolean>;
};

type RustCalls = keyof RustApi;
type NoArgCalls = {
    [Key in RustCalls]:
        RustApi[Key] extends RustApiTypes<infer Args, any>
        ? Utils.Types.Equals<Args, {}> extends false
            ? never
            : Key
        : never;
}[RustCalls];

type RustEventApi = {
    refresh_apps: {};
};
type RustEvents = keyof RustEventApi;
type NoArgEvents = {
    [Key in RustEvents]:
        Utils.Types.Equals<RustEventApi[Key], {}> extends true
        ? Key
        : never;
}[RustEvents];

type InvokeRustArgs<T extends RustCalls> =
    T extends NoArgCalls
    ? [ cmd: T ]
    : [ cmd: T, args: RustApi[T]['args'] ];

type InvokeRustReturn<T extends RustCalls> = Promise<RustApi[T]['return']>;

export const invokeRust = <T extends RustCalls>(...args: InvokeRustArgs<T>): InvokeRustReturn<T> => invoke(args[0], args[1]);

export const listenRust = <T extends RustEvents>(event: T, callback: EventCallback<RustEventApi[T]>) => listen(event, callback);