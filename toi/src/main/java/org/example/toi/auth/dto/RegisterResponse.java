package org.example.toi.auth.dto;

public record RegisterResponse(
        String message,
        AuthUserView user
) {
}
