import apiClient from './apiClient';

const THREADS_CLIENT_ID = '2641741729534125';
const THREADS_REDIRECT_URI = 'https://toi.com.kz/auth/callback';
const THREADS_SCOPE = 'threads_basic';

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

    loginWithThreads: async (code) => {
        const response = await apiClient.post('/auth/threads', { code });
        if (response.data?.accessToken) {
            localStorage.setItem('access_token', response.data.accessToken);
            localStorage.setItem('refresh_token', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    getThreadsOAuthUrl: () => {
        const params = new URLSearchParams({
            client_id: THREADS_CLIENT_ID,
            redirect_uri: THREADS_REDIRECT_URI,
            scope: THREADS_SCOPE,
            response_type: 'code',
        });
        return `https://threads.net/oauth/authorize?${params.toString()}`;
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

