import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DeploymentPath, invokeRust } from '../rustApi';
import { LoaderHookReturn, withLoader } from './hoc';

const EditApp = ({ name: [name, setName], deploymentPaths: [deploymentPaths, setDeploymentPaths], saveApp }: EditAppProps) => {

    const saveChangesOnClick = () => {
        console.log("Save result:", saveApp());
    }

    return (
        <div>
            <h1>New App</h1>
            <div>
                <button onClick={saveChangesOnClick}>Save Changes</button>
            </div>
            <div>
                <h2>Name</h2>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
                <h2>Deployment Paths <button>+</button></h2>
            </div>
        </div>
    )
};

type EditAppProps = {
    id?: number;
    name: StateHook<string>;
    deploymentPaths: StateHook<DeploymentPath[]>;
    saveApp: () => Promise<boolean>;
};

type StateHook<T> = [T, (value: T) => void];

const useAppData = () => {
    const [loading, setLoading] = useState(true);

    const { appId } = useParams();
    const [id, setId] = useState(Number(appId));

    const [name, setName] = useState('');

    const [deploymentPaths, setDeploymentPaths] = useState([] as DeploymentPath[]);

    useEffect(() => {
        invokeRust('load_app', { id }).then(app => {
            console.log('loaded app', app);
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
        
        return invokeRust('save_app', { app });
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