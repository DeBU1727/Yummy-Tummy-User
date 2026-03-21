import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});

// Request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle expired tokens (403/401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config && error.config.url ? error.config.url : '';
        const isAuthPath = url.includes('/auth/') || url.includes('/otp/') || url.includes('/login');
        
        
        const isPasswordUpdateEndpoint = url.includes('/user/password');

        if (!isAuthPath && (error.response?.status === 401 || error.response?.status === 403) && !isPasswordUpdateEndpoint) {
            // If the token is invalid or expired, clear local storage and refresh
            console.warn("Session expired or unauthorized. Logging out...");
            localStorage.removeItem('token');
            // We use window.location to force a clean state
            if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
