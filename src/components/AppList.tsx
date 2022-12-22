import { useEffect, useState } from 'react';
import { listenRust } from '../rustApi';
import * as appsPlugin from '../rustApi/apps';
import * as settingsPlugin from '../rustApi/settings';
import { PublishableApp } from '../rustApi/apps';
import { LoaderHookReturn, withLoader } from './hoc';

const App = ({ app }: AppProps) => {
    return <div>{app.id}: {app.name}</div>;
};

type AppProps = {
    app: PublishableApp;
};

const AppList = ({ apps, onNewApp, onOpenSettings }: AppListProps) => {
    return (
        <div>
            <div className="row">
                <button onClick={onOpenSettings}>Settings</button>
            </div>
            <h1>App List <button className="sm" onClick={onNewApp}>+</button></h1>
            <div>
                {apps.map(app => <App key={app.id} app={app} />)}
            </div>
        </div>
    );
};

type AppListProps = {
    apps: PublishableApp[];
    onNewApp: () => void;
    onOpenSettings: () => void;
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

        const unlisten = listenRust('refresh_apps', () => {
            loadApps();
        });

        loadApps();

        return () => {
            unlisten.then(unlisten => unlisten());
        };

    }, []);
    
    const onNewApp = () => appsPlugin.invoke('new_app');
    const onOpenSettings = () => settingsPlugin.invoke('open_settings');

    return {
        loading,
        apps,
        onNewApp,
        onOpenSettings,
    } satisfies LoaderHookReturn<AppListProps>;
};

const AppListLoader = withLoader(AppList, useAppListData);

export default AppListLoader;