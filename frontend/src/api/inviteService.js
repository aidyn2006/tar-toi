import apiClient from './apiClient';

export const inviteService = {
    /** GET /api/v1/invites/my — list current user's invites */
    getMyInvites: () => apiClient.get('/invites/my').then(r => r.data),

    /** POST /api/v1/invites — create a new invite */
    createInvite: (payload) => apiClient.post('/invites', payload).then(r => r.data),

    /** PUT /api/v1/invites/{id} — update existing invite (owner only) */
    updateInvite: (id, payload) => apiClient.put(`/invites/${id}`, payload).then(r => r.data),

    /** GET /api/v1/invites/slug/{slug} — public invite (no auth) */
    getBySlug: (slug) => apiClient.get(`/invites/slug/${slug}`).then(r => r.data),

    /** GET /api/v1/invites/{id}/responses — CRM guest list (owner only) */
    getResponses: (id) => apiClient.get(`/invites/${id}/responses`).then(r => r.data),

    /** POST /api/v1/invites/{id}/respond — RSVP (public, no auth) */
    respond: (id, payload) => apiClient.post(`/invites/${id}/respond`, payload).then(r => r.data),
};
