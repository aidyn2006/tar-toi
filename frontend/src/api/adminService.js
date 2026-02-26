import apiClient from './apiClient';

export const adminService = {
    /** Get pending users */
    getPending: () => apiClient.get('/admin/users/pending').then(r => r.data),

    /** Get all users */
    getAllUsers: () => apiClient.get('/admin/users').then(r => r.data),

    /** Approve user */
    approveUser: (id) => apiClient.post(`/admin/users/${id}/approve`).then(r => r.data),

    /** Delete/reject user */
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`).then(r => r.data),
};
