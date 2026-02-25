package org.example.toi.auth.dto;

public record AuthUserView(
        String username,
        String fullName,
        String role,
        Boolean approved
) {
}
