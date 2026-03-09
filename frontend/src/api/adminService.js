import apiClient from './apiClient';

export const adminService = {
    /** Get pending users */
    getPending: () => apiClient.get('/admin/users/pending').then(r => r.data),

    /** Get all users with pagination */
    getAllUsers: (page = 0, size = 20) => apiClient.get(`/admin/users?page=${page}&size=${size}`).then(r => r.data),

    /** Approve user */
    approveUser: (id) => apiClient.post(`/admin/users/${id}/approve`).then(r => r.data),

    /** Delete/reject user */
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`).then(r => r.data),

    /** Get all invitations for admin */
    getAllInvites: () => apiClient.get('/admin/invites').then(r => r.data),

    /** Toggle invite active status */
    toggleInviteActive: (id) => apiClient.post(`/admin/invites/${id}/toggle-active`).then(r => r.data),
};
