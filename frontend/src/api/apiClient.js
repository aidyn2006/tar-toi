import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    // Token refresh logic would go here
                    // For now, logout on 401 as per simple architecture requirement
                    localStorage.clear();
                    window.location.href = '/';
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = '/';
                }
            } else {
                localStorage.clear();
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
