import { useEffect, useState } from 'react';
import * as appsPlugin from '../rustApi/apps';
import * as settingsPlugin from '../rustApi/settings';
import { PublishableApp } from '../rustApi/apps';
import { LoaderHookReturn, withLoader } from './hoc';

const App = ({ app, onEditApp }: AppProps) => {
    return (
        <div>
            <span>{app.id}: {app.name}</span>
            <button onClick={onEditApp}>Edit</button>
        </div>
    );
};

type AppProps = {
    app: PublishableApp;
    onEditApp: () => void;
};

const AppList = ({ apps, onNewApp, onOpenSettings, onEditApp }: AppListProps) => (
    <div>
        <div className="row">
            <button onClick={onOpenSettings}>Settings</button>
        </div>
        <h1>App List <button className="sm" onClick={onNewApp}>+</button></h1>
        <div>
            {apps.map(app => <App key={app.id} app={app} onEditApp={() => onEditApp(app.id)} />)}
        </div>
    </div>
);

type AppListProps = {
    apps: PublishableApp[];
    onNewApp: () => void;
    onOpenSettings: () => void;
    onEditApp: (id: number) => void;
};

const useAppListData = () => {
    const [loading, setLoading] = useState(true);

    const [apps, setApps] = useState([] as PublishableApp[]);

    useEffect(() => {

        const loadApps = () => {
            appsPlugin.invoke('get_apps').then(apps => {
                setApps(apps);
                setLoading(false);
            });
        };

        const unlisten = appsPlugin.listen('refresh_apps', () => {
            loadApps();
        });

        loadApps();

        return () => {
            unlisten.then(unlisten => unlisten());
        };

    }, []);
    
    const onNewApp = () => appsPlugin.invoke('new_app');
    const onOpenSettings = () => settingsPlugin.invoke('open_settings');
    const onEditApp = (id: number) => appsPlugin.invoke('edit_app', { id });

    return {
        loading,
        apps,
        onNewApp,
        onOpenSettings,
        onEditApp,
    } satisfies LoaderHookReturn<AppListProps>;
};

const AppListLoader = withLoader(AppList, useAppListData);

export default AppListLoader;