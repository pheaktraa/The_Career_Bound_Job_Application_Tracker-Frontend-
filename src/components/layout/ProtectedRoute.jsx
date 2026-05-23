import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // If the user is not authenticated, redirect them to the login page.
    // We pass the current location in state so we can redirect them back after login if desired.
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If they are authenticated, render the child routes using <Outlet />
    return <Outlet />;
};

export default ProtectedRoute;
