package org.example.toi.service;

import java.util.List;
import java.util.UUID;
import org.example.toi.dto.request.CreateInviteRequest;
import org.example.toi.dto.request.RespondInviteRequest;
import org.example.toi.dto.request.UpdateInviteRequest;
import org.example.toi.dto.response.GuestResponseDTO;
import org.example.toi.dto.response.InviteResponseDTO;

public interface InviteService {
    InviteResponseDTO createInvite(CreateInviteRequest request);
    List<InviteResponseDTO> getMyInvites();
    List<InviteResponseDTO> getAllInvites();
    InviteResponseDTO getPublicInvite(String slug);
    InviteResponseDTO updateInvite(UUID id, UpdateInviteRequest request);
    List<GuestResponseDTO> getResponses(UUID inviteId);
    void respondToInvite(UUID inviteId, RespondInviteRequest request);
    void deleteInvite(UUID id);
    void toggleActive(UUID id);
}
