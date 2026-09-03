import { Navigate, useLocation } from 'react-router-dom';

const PublicRoutes = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (token) {
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
};

export default PublicRoutes;
