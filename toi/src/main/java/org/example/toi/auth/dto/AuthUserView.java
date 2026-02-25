package org.example.toi.auth.dto;

public record AuthUserView(
        String phone,
        String fullName,
        String role,
        Boolean approved
) {
}
