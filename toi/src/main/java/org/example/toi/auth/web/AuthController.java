package org.example.toi.auth.web;

import jakarta.validation.Valid;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.example.toi.auth.dto.AuthUserView;
import org.example.toi.auth.dto.AuthResponse;
import org.example.toi.auth.dto.LoginRequest;
import org.example.toi.auth.dto.MeResponse;
import org.example.toi.auth.dto.RegisterRequest;
import org.example.toi.auth.dto.RegisterResponse;
import org.example.toi.auth.service.AuthService;
import org.example.toi.auth.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(
                request.fullName(),
                request.username(),
                request.password(),
                request.confirmPassword()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request.username(), request.password());
    }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        String username = authentication.getName();
        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        AuthUserView userView = userService.findByUsername(username)
                .map(user -> new AuthUserView(user.username(), user.fullName(), roles, user.approved()))
                .orElseGet(() -> new AuthUserView(username, username, roles, false));

        return new MeResponse(userView);
    }
}
