import apiClient from './apiClient';

export const uploadService = {
    uploadImage: async (file, category) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post(`/uploads/image${category ? `?category=${encodeURIComponent(category)}` : ''}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return normalize(res.data);
    },
    uploadAudio: async (file, category) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post(`/uploads/audio${category ? `?category=${encodeURIComponent(category)}` : ''}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return normalize(res.data);
    },
    list: async (type, category) => {
        const res = await apiClient.get(`/uploads/list?type=${encodeURIComponent(type)}${category ? `&category=${encodeURIComponent(category)}` : ''}`);
        return Array.isArray(res.data) ? res.data : [];
    },
};

function normalize(data = {}) {
    return {
        url: data.url || data.path || '',
        path: data.path || data.url || '',
    };
}
