import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as appsPlugin from '../rustApi/apps';
import { DeploymentPath } from '../rustApi/apps';
import Utils from '../Utils';
import { LoaderHookReturn, withLoader } from './hoc';

const EditApp = ({ name: [name, setName], deploymentPaths: [deploymentPaths, setDeploymentPaths], saveApp }: EditAppProps) => {

    const saveChangesOnClick = () => {
        console.log("Save result:", saveApp());
    }

    return (
        <div>
            <h1>New App</h1>
            <div className="row">
                <button onClick={saveChangesOnClick}>Save Changes</button>
            </div>
            <div className="row">
                <h2>Name</h2>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="row">
                <h2>Deployment Paths <button className="sm">+</button></h2>
            </div>
        </div>
    )
};

type EditAppProps = {
    id?: number;
    name: Utils.Types.ReactStateHook<string>;
    deploymentPaths: Utils.Types.ReactStateHook<DeploymentPath[]>;
    saveApp: () => Promise<boolean>;
};

const useAppData = () => {
    const [loading, setLoading] = useState(true);

    const { appId } = useParams();
    const [id, setId] = useState(Number(appId));

    const [name, setName] = useState('');

    const [deploymentPaths, setDeploymentPaths] = useState([] as DeploymentPath[]);

    useEffect(() => {
        appsPlugin.invoke('load_app', { id }).then(app => {
            if (!app) return;

            setId(app.id);
            setName(app.name);
            setLoading(false);
        })
    }, []);

    const saveApp = () => {
        console.log('saveApp() called');
        const app = {
            id,
            name,
            deployment_paths: deploymentPaths,
        };
        
        return appsPlugin.invoke('save_app', { app });
    };

    return {
        loading,
        id,
        name: [name, setName],
        deploymentPaths: [deploymentPaths, setDeploymentPaths],
        saveApp,
    } satisfies LoaderHookReturn<EditAppProps>;
};

const EditAppLoader = withLoader(EditApp, useAppData);

export default EditAppLoader;