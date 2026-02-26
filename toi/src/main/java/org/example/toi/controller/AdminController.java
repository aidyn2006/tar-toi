package org.example.toi.controller;

import lombok.RequiredArgsConstructor;
import org.example.toi.entity.User;
import org.example.toi.repository.UserRepository;
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

    /** List all users (for admin panel) */
    @GetMapping("/users")
    public List<Map<String, Object>> listUsers() {
        return userRepository.findAll().stream().map(u -> Map.<String, Object>of(
                "id", u.getId(),
                "phone", u.getPhone(),
                "fullName", u.getFullName(),
                "role", u.getRole().name(),
                "approved", u.isApproved(),
                "createdAt", u.getCreatedAt()
        )).toList();
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
    public ResponseEntity<Map<String, String>> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User approved"));
    }

    /** Reject (delete) a user */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }
}
