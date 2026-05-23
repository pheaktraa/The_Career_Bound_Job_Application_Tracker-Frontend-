import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // While AuthContext is still fetching the user, show a loading state
    // instead of immediately redirecting to login
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If the user is not authenticated, redirect them to the login page.
    // We pass the current location in state so we can redirect them back after login if desired.
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If they are authenticated, render the child routes using <Outlet />
    return <Outlet />;
};

export default ProtectedRoute;
