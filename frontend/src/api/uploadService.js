import apiClient from './apiClient';

export const uploadService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post('/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return normalize(res.data);
    },
    uploadAudio: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post('/uploads/audio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return normalize(res.data);
    },
};

function normalize(data = {}) {
    return {
        url: data.url || data.path || '',
        path: data.path || data.url || '',
    };
}
