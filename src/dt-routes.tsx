import App from './App';
import EditAppLoader from './components/EditApp';

import { Routes, Route } from 'react-router-dom';

const DTRoutes = () => {
    return (
        <Routes>
            <Route index element={<App />} />
            <Route path='edit_app/:appName?' element={<EditAppLoader />} />
        </Routes>
    );
};

export default DTRoutes;