import EditAppLoader from './components/EditApp';
import AppListLoader from './components/AppList';

import { Routes, Route } from 'react-router-dom';

const DTRoutes = () => {
    return (
        <Routes>
            <Route index element={<AppListLoader />} />
            <Route path='edit_app/:appName?' element={<EditAppLoader />} />
        </Routes>
    );
};

export default DTRoutes;