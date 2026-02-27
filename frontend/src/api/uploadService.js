import apiClient from './apiClient';

export const uploadService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post('/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },
    uploadAudio: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post('/uploads/audio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },
};
