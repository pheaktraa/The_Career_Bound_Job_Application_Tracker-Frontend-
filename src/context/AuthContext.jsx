import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isLoading, setIsLoading] = useState(!!localStorage.getItem('token'));

    // Fetch the user profile whenever a token exists but user is null
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Only fetch if we don't already have the user data
            if (!user) {
                fetchUser();
            }
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setIsLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch (err) {
            console.error('Failed to fetch user:', err);
            // Token is likely invalid/expired — force logout
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
