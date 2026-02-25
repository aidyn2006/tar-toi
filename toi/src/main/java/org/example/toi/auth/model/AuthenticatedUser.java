package org.example.toi.auth.model;

public record AuthenticatedUser(
        String phone,
        String fullName,
        String role,
        Boolean approved
) {
}
