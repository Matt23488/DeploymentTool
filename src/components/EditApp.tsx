import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as appsPlugin from '../rustApi/apps';
import * as fsPlugin from '../rustApi/fs';
import { DeploymentPath } from '../rustApi/apps';
import Utils from '../Utils';
import { LoaderHookReturn, withLoader } from './hoc';

const DeploymentPath_ = ({
    name: [name, setName],
    inputPath: [inputPath, setInputPath],
    outputPath: [outputPath, setOutputPath],
}: DeploymentPathProps) => {

    type PathType = 'input' | 'output';
    const getOnBrowse = (type: PathType) => async () => {
        const path = await fsPlugin.browseDirectory();
        if (!path) return;

        const setPath = type === 'input' ? setInputPath : setOutputPath;
        setPath(path);
    };

    return (
        <div>
            <label>Name:</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <label>Input Path:</label>
            <span>{inputPath}</span>
            <button onClick={getOnBrowse('input')}>Browse</button>
            <label>Output Path:</label>
            <span>{outputPath}</span>
            <button onClick={getOnBrowse('output')}>Browse</button>
        </div>
    )
};

type DeploymentPathProps = {
    name: Utils.Types.ReactStateHook<string>;
    inputPath: Utils.Types.ReactStateHook<string>;
    outputPath: Utils.Types.ReactStateHook<string>;
};

const EditApp = ({ name: [name, setName], deploymentPaths: [deploymentPaths, addDeploymentPath], saveApp }: EditAppProps) => {
    return (
        <div>
            <h1>App Details</h1>
            <div className="row">
                <button onClick={saveApp}>Save Changes</button>
            </div>
            <div className="row">
                <h2>Name</h2>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <h2>Deployment Paths <button className="sm" onClick={addDeploymentPath}>+</button></h2>
            {deploymentPaths.map(([dp, sdp], i) => {
                const setName = (name: string) => sdp({ ...dp, name });
                const setInputPath = (input_path: string) => sdp({ ...dp, input_path });
                const setOutputPath = (output_path: string) => sdp({ ...dp, output_path });

                return <DeploymentPath_ key={i} name={[dp.name, setName]} inputPath={[dp.input_path, setInputPath]} outputPath={[dp.output_path, setOutputPath]} />;
            })}
        </div>
    )
};

type EditAppProps = {
    id?: number;
    name: Utils.Types.ReactStateHook<string>;
    deploymentPaths: [Utils.Types.ReactStateHook<DeploymentPath>[], () => void];
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

    const _deploymentPaths = deploymentPaths.map((p, i) => {
        const setDeploymentPath = (newP: DeploymentPath) => {
            setDeploymentPaths([...deploymentPaths.slice(0, i), newP, ...deploymentPaths.slice(i + 1)]);
        };

        return [p, setDeploymentPath] as Utils.Types.ReactStateHook<DeploymentPath>;
    });

    const addDeploymentPath = () => setDeploymentPaths([...deploymentPaths, { name: '', input_path: '', output_path: '' }]);

    return {
        loading,
        id,
        name: [name, setName],
        deploymentPaths: [_deploymentPaths, addDeploymentPath],
        saveApp,
    } satisfies LoaderHookReturn<EditAppProps>;
};

const EditAppLoader = withLoader(EditApp, useAppData);

export default EditAppLoader;