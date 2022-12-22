import { invoke } from '@tauri-apps/api';
import { EventCallback, listen, once } from '@tauri-apps/api/event';
import Utils from '../Utils';

export type RustApiTypes<Args extends {} = {}, Return = void> = {
    args: Args;
    return: Return;
};

type PluginApi = Record<string, RustApiTypes<any, any>>;

type CallsWithArguments<Api extends PluginApi> = {
    [Key in keyof Api]:
        Api[Key] extends RustApiTypes<infer Args, any>
        ? Utils.Types.Equals<Args, {}> extends true
            ? never
            : Key
        : never;
}[keyof Api];

type InvokeApiArgs<Api extends PluginApi, Call extends string & keyof Api> =
    Call extends CallsWithArguments<Api>
    ? [ cmd: Call, args: Api[Call]['args'] ]
    : [ cmd: Call ];

type InvokeApiReturn<Api extends PluginApi, Call extends string & keyof Api> = Promise<Api[Call]['return']>;

type InvokeApiFn<Api extends PluginApi> = <Call extends string & keyof Api>(...args: InvokeApiArgs<Api, Call>) => InvokeApiReturn<Api, Call>;

export const getInvokeFn = <Api extends PluginApi>(pluginName: string): InvokeApiFn<Api> => <Call extends string & keyof Api>(...args: InvokeApiArgs<Api, Call>): InvokeApiReturn<Api, Call> => invoke(`plugin:${pluginName}|${args[0]}`, args[1]);
export const getListenFn = <EventsApi extends {}>(pluginName: string) => <Event extends string & keyof EventsApi>(event: Event, callback: EventCallback<EventsApi[Event]>) => listen(`plugin:${pluginName}__${event}`, callback);
export const getOnceFn = <EventsApi extends {}>(pluginName: string) => <Event extends string & keyof EventsApi>(event: Event, callback: EventCallback<EventsApi[Event]>) => once(`plugin:${pluginName}__${event}`, callback);