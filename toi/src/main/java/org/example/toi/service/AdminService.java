package org.example.toi.service;

import java.util.List;
import java.util.UUID;
import org.example.toi.dto.response.AdminUserResponse;
import org.example.toi.dto.response.InviteResponseDTO;
import org.example.toi.dto.response.MessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    Page<AdminUserResponse> listUsers(Pageable pageable);
    List<AdminUserResponse> listPending();
    MessageResponse approveUser(Long id);
    MessageResponse deleteUser(Long id);
    List<InviteResponseDTO> listInvites();
    MessageResponse toggleInvite(UUID id);
}
