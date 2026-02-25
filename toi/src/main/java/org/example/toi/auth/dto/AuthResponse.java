package org.example.toi.auth.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        Long expiresInSeconds,
        AuthUserView user
) {
}
