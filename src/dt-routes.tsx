import EditAppLoader from './components/EditApp';
import AppListLoader from './components/AppList';

import { Routes, Route } from 'react-router-dom';
import SettingsLoader from './components/Settings';

const DTRoutes = () => {
    return (
        <Routes>
            <Route index element={<AppListLoader />} />
            <Route path="edit_app/:appName?" element={<EditAppLoader />} />
            <Route path="settings" element={<SettingsLoader />} />
        </Routes>
    );
};

export default DTRoutes;