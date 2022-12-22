import { useEffect, useState } from 'react';
import { PublishableApp, invokeRust, listenRust } from '../rustApi';
import { LoaderHookReturn, withLoader } from './hoc';

const App = ({ app }: AppProps) => {
    return <div>{app.id}: {app.name}</div>;
};

type AppProps = {
    app: PublishableApp;
};

const AppList = ({ apps, onNewApp }: AppListProps) => {
    return (
        <div>
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
};

const useAppListData = () => {
    const [loading, setLoading] = useState(true);

    const [apps, setApps] = useState([] as PublishableApp[]);

    useEffect(() => {

        const loadApps = () => {
            invokeRust('get_apps').then(apps => {
                setApps(apps);
                setLoading(false);
            });
        };

        const unlisten = listenRust('refresh_apps', event => {
            loadApps();
        });

        loadApps();

        return () => {
            unlisten.then(unlisten => unlisten());
        };

    }, []);
    
    const onNewApp = () => invokeRust('new_app');

    return {
        loading,
        apps,
        onNewApp,
    } satisfies LoaderHookReturn<AppListProps>;
};

const AppListLoader = withLoader(AppList, useAppListData);

export default AppListLoader;