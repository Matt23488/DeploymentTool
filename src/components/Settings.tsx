import { useEffect, useState } from 'react';
import * as settingsPlugin from '../rustApi/settings';
import * as fsPlugin from '../rustApi/fs';
import { LoaderHookReturn, withLoader } from './hoc';

const Settings = ({
    inputPath,
    outputPath,
    getOnBrowsePath,
    saveSettings,
}: SettingsProps) => {
    return (
        <div>
            <h1>Settings</h1>
            <div className="row">
                <button onClick={saveSettings}>Save</button>
            </div>
            <div className="row">
                <label>Input Path:</label>
                <span>{inputPath}</span>
                <button onClick={getOnBrowsePath('input')}>Browse</button>
            </div>
            <div className="row">
                <label>Output Path:</label>
                <span>{outputPath}</span>
                <button onClick={getOnBrowsePath('output')}>Browse</button>
            </div>
        </div>
    )
};

type PathType = 'input' | 'output';

type SettingsProps = {
    inputPath: string;
    outputPath: string;
    getOnBrowsePath: (type: PathType) => () => void;
    saveSettings: () => void;
};

const useSettingsData = () => {
    const [loading, setLoading] = useState(true);

    const [inputPath, setInputPath] = useState('');
    const [outputPath, setOutputPath] = useState('');

    useEffect(() => {
        settingsPlugin.invoke('load_settings').then(settings => {
            setInputPath(settings.input_path);
            setOutputPath(settings.output_path);
            setLoading(false);
        });
    }, []);

    const saveSettings = () => {
        const store = {
            input_path: inputPath,
            output_path: outputPath,
        };

        settingsPlugin.invoke('save_settings', { store });
    };

    const getOnBrowsePath = (type: PathType) => async () => {
        const path = await fsPlugin.browseDirectory();
        if (!path) return;

        const setPath = type === 'input' ? setInputPath : setOutputPath;
        setPath(path);
    };

    return {
        loading,
        inputPath,
        outputPath,
        getOnBrowsePath,
        saveSettings,
    } satisfies LoaderHookReturn<SettingsProps>;
};

const SettingsLoader = withLoader(Settings, useSettingsData);

export default SettingsLoader;