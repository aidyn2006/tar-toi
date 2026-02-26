import apiClient from './apiClient';

export const inviteService = {
    /** GET /api/v1/invites/my — list current user's invites */
    getMyInvites: () => apiClient.get('/invites/my').then(r => r.data),

    /** POST /api/v1/invites — create a new invite */
    createInvite: (payload) => apiClient.post('/invites', payload).then(r => r.data),

    /** POST /api/v1/invites/{id}/respond — respond to invite (public) */
    respond: (id, payload) => apiClient.post(`/invites/${id}/respond`, payload).then(r => r.data),
};
