import apiClient from './apiClient';

function normalizeInviteResponse(rawInvite) {
    if (!rawInvite || typeof rawInvite !== 'object') return rawInvite;

    const payload = rawInvite.payload && typeof rawInvite.payload === 'object'
        ? rawInvite.payload
        : {};
    const isActive = rawInvite.isActive ?? rawInvite.active ?? payload.isActive ?? payload.active ?? false;
    const ownerName = rawInvite.ownerName || rawInvite.ownerFullName || payload.ownerName || payload.ownerFullName || '';

    return {
        ...payload,
        id: rawInvite.id ?? payload.id,
        slug: rawInvite.slug ?? payload.slug,
        ownerName,
        ownerFullName: ownerName,
        responsesCount: rawInvite.responsesCount ?? payload.responsesCount ?? 0,
        isActive,
        active: isActive,
        payload,
    };
}

function wrapPayload(payload) {
    return { payload };
}

export const inviteService = {
    getMyInvites: () => apiClient.get('/invites/my').then((r) => (r.data || []).map(normalizeInviteResponse)),

    createInvite: (payload) => apiClient
        .post('/invites', wrapPayload(payload))
        .then((r) => normalizeInviteResponse(r.data)),

    deleteInvite: (id) => apiClient.delete(`/invites/${id}`).then((r) => r.data),

    updateInvite: (id, payload) => apiClient
        .put(`/invites/${id}`, wrapPayload(payload))
        .then((r) => normalizeInviteResponse(r.data)),

    getBySlug: (slug) => apiClient.get(`/invites/slug/${slug}`).then((r) => normalizeInviteResponse(r.data)),

    getResponses: (id) => apiClient.get(`/invites/${id}/responses`).then((r) => r.data),

    respond: (id, payload) => apiClient.post(`/invites/${id}/respond`, payload).then((r) => r.data),
};
