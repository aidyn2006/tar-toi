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

let isRefreshing = false;
let pendingRequests = [];

function onRefreshDone(token) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

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
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh');

    if (status === 401 && !isAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingRequests.push((newToken) => {
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(apiClient(originalRequest));
              } else {
                reject(error);
              }
            });
          });
        }

        isRefreshing = true;
        try {
          const response = await apiClient.post('/auth/refresh', { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('access_token', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          onRefreshDone(accessToken);
          return apiClient(originalRequest);
        } catch {
          onRefreshDone(null);
        } finally {
          isRefreshing = false;
        }
      }

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
