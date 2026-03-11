package org.example.toi.controller;

import lombok.RequiredArgsConstructor;
import org.example.toi.dto.response.InviteResponseDTO;
import org.example.toi.entity.User;
import org.example.toi.repository.UserRepository;
import org.example.toi.service.InviteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final InviteService inviteService;

    /** List all users (for admin panel) with pagination */
    @GetMapping("/users")
    public org.springframework.data.domain.Page<Map<String, Object>> listUsers(
            @org.springframework.data.web.PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) org.springframework.data.domain.Pageable pageable) {
        return userRepository.findAll(pageable).map(u -> Map.<String, Object>of(
                "id", u.getId(),
                "phone", u.getPhone(),
                "fullName", u.getFullName() != null ? u.getFullName() : "",
                "role", u.getRole().name(),
                "approved", u.isApproved(),
                "createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""
        ));
    }

    @GetMapping("/invites")
    public ResponseEntity<List<InviteResponseDTO>> getMyInvites() {
        return ResponseEntity.ok(inviteService.getAllInvites());
    }

    /** List only pending (not approved) users */
    @GetMapping("/users/pending")
    public List<Map<String, Object>> listPending() {
        return userRepository.findAll().stream()
                .filter(u -> !u.isApproved())
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "phone", u.getPhone(),
                        "fullName", u.getFullName(),
                        "createdAt", u.getCreatedAt()
                )).toList();
    }

    /** Approve a user */
    @PostMapping("/users/{id}/approve")
    public ResponseEntity<Map<String, String>> approveUser(@PathVariable("id") Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User approved"));
    }

    /** Reject (delete) a user */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable("id") Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setDeleted(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    /** Toggle invite active status */
    @PostMapping("/invites/{id}/toggle-active")
    public ResponseEntity<Map<String, String>> toggleInviteActive(@PathVariable("id") java.util.UUID id) {
        inviteService.toggleActive(id);
        return ResponseEntity.ok(Map.of("message", "Invite active status toggled"));
    }
}
