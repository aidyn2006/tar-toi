import apiClient from './apiClient';

export const authService = {
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data?.accessToken) {
            localStorage.setItem('access_token', response.data.accessToken);
            localStorage.setItem('refresh_token', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        if (response.data?.accessToken) {
            localStorage.setItem('access_token', response.data.accessToken);
            localStorage.setItem('refresh_token', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.clear();
        window.location.href = '/';
    },

    getUser: () => {
        const raw = localStorage.getItem('user');
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
    },

    isLoggedIn: () => !!localStorage.getItem('access_token'),
    isApproved: () => {
        const u = authService.getUser();
        return u?.approved === true;
    },
    isAdmin: () => {
        const u = authService.getUser();
        return u?.role === 'ADMIN';
    }
};
