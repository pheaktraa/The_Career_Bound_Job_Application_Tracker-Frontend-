import axios from 'axios';

const api = axios.create({
    // Use the variable from the .env file instead of hardcoding the URL
    baseURL: import.meta.env.VITE_API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
