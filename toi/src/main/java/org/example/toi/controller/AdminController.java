package org.example.toi.controller;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.example.toi.dto.response.AdminUserResponse;
import org.example.toi.dto.response.InviteResponseDTO;
import org.example.toi.dto.response.MessageResponse;
import org.example.toi.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    /** List all users (for admin panel) with pagination */
    @GetMapping("/users")
    public Page<AdminUserResponse> listUsers(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return adminService.listUsers(pageable);
    }

    @GetMapping("/invites")
    public ResponseEntity<List<InviteResponseDTO>> listInvites() {
        return ResponseEntity.ok(adminService.listInvites());
    }

    /** List only pending (not approved) users */
    @GetMapping("/users/pending")
    public List<AdminUserResponse> listPending() {
        return adminService.listPending();
    }

    /** Approve a user */
    @PostMapping("/users/{id}/approve")
    public ResponseEntity<MessageResponse> approveUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveUser(id));
    }

    /** Reject (delete) a user */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteUser(id));
    }

    /** Toggle invite active status */
    @PostMapping("/invites/{id}/toggle-active")
    public ResponseEntity<MessageResponse> toggleInviteActive(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.toggleInvite(id));
    }
}
