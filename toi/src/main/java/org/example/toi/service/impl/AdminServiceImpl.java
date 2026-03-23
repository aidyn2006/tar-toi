package org.example.toi.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.example.toi.common.exception.NotFoundException;
import org.example.toi.dto.response.AdminUserResponse;
import org.example.toi.dto.response.InviteResponseDTO;
import org.example.toi.dto.response.MessageResponse;
import org.example.toi.entity.User;
import org.example.toi.repository.UserRepository;
import org.example.toi.service.AdminService;
import org.example.toi.service.InviteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final InviteService inviteService;

    @Override
    public Page<AdminUserResponse> listUsers(Pageable pageable) {
        return userRepository.findAllByIsDeletedFalse(pageable)
                .map(this::toResponse);
    }

    @Override
    public List<AdminUserResponse> listPending() {
        return userRepository.findAllByIsDeletedFalse().stream()
                .filter(u -> !u.isApproved())
                .map(this::toResponse)
                .toList();
    }

    @Override
    public MessageResponse approveUser(Long id) {
        User user = userRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.setApproved(true);
        userRepository.save(user);
        return new MessageResponse("User approved");
    }

    @Override
    public MessageResponse deleteUser(Long id) {
        User user = userRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.setDeleted(true);
        userRepository.save(user);
        return new MessageResponse("User deleted");
    }

    @Override
    public List<InviteResponseDTO> listInvites() {
        return inviteService.getAllInvites();
    }

    @Override
    public MessageResponse toggleInvite(UUID id) {
        inviteService.toggleActive(id);
        return new MessageResponse("Invite active status toggled");
    }

    private AdminUserResponse toResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .phone(user.getPhone())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .approved(user.isApproved())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
