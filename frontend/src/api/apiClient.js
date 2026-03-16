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

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = originalRequest.url || '';
    const isAuthRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register');

    if (status === 401 && !isAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      const currentPath = `${window.location.pathname}${window.location.search}`;
      const params = new URLSearchParams({
        auth: 'login',
        reason: 'session-expired',
        next: currentPath,
      });

      window.location.href = `/?${params.toString()}`;
    }

    return Promise.reject(error);
  }
);

export default apiClient;