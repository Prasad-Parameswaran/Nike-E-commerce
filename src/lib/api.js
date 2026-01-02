import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: '/api', // Proxies to Next.js API routes
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Token
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle Errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors
        return Promise.reject(error);
    }
);

export default api;
