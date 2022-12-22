import { useEffect, useState } from 'react';
import * as settingsPlugin from '../rustApi/settings';
import Utils from '../Utils';
import { LoaderHookReturn, withLoader } from './hoc';

const Settings = ({
    inputPath: [inputPath, setInputPath],
    outputPath: [outputPath, setOutputPath],
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
                <input type="text" value={inputPath} onChange={e => setInputPath(e.target.value)} />
            </div>
            <div className="row">
                <label>Output Path:</label>
                <input type="text" value={outputPath} onChange={e => setOutputPath(e.target.value)} />
            </div>
        </div>
    )
};

type SettingsProps = {
    inputPath: Utils.Types.ReactStateHook<string>;
    outputPath: Utils.Types.ReactStateHook<string>;
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

    return {
        loading,
        inputPath: [inputPath, setInputPath],
        outputPath: [outputPath, setOutputPath],
        saveSettings,
    } satisfies LoaderHookReturn<SettingsProps>;
};

const SettingsLoader = withLoader(Settings, useSettingsData);

export default SettingsLoader;