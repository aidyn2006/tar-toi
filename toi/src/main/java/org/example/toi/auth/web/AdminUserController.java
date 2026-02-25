package org.example.toi.auth.web;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.example.toi.auth.dto.AuthUserView;
import org.example.toi.auth.model.AuthenticatedUser;
import org.example.toi.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<AuthUserView> listUsers() {
        return userService.findAll().stream()
                .map(this::toView)
                .collect(Collectors.toList());
    }

    @PostMapping("/{username}/approve")
    public ResponseEntity<AuthUserView> approve(@PathVariable("username") String username) {
        AuthenticatedUser user = userService.approveUser(username);
        return ResponseEntity.ok(toView(user));
    }

    private AuthUserView toView(AuthenticatedUser user) {
        Set<String> roles = user.roles();
        return new AuthUserView(user.username(), user.fullName(), roles, user.approved());
    }
}

