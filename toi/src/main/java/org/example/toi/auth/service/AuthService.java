package org.example.toi.auth.service;

import org.example.toi.auth.dto.AuthUserView;
import org.example.toi.auth.dto.AuthResponse;
import org.example.toi.auth.dto.RegisterResponse;
import org.example.toi.auth.model.AuthenticatedUser;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserService userService;
    private final JwtService jwtService;

    public AuthService(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(String fullName, String username, String password, String confirmPassword) {
        AuthenticatedUser user = userService.register(fullName, username, password, confirmPassword);
        return new RegisterResponse("Аккаунт создан", toView(user));
    }

    public AuthResponse login(String username, String password) {
        AuthenticatedUser user = userService.authenticate(username, password);
        String accessToken = jwtService.createAccessToken(user);
        return new AuthResponse(
                accessToken,
                "Bearer",
                jwtService.getExpirationSeconds(),
                toView(user)
        );
    }

    public AuthUserView toView(AuthenticatedUser user) {
        return new AuthUserView(user.username(), user.fullName(), user.roles(), user.approved());
    }
}
