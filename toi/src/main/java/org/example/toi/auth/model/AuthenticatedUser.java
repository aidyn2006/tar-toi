package org.example.toi.auth.model;

public record AuthenticatedUser(
        String username,
        String fullName,
        String role,
        Boolean approved
) {
}
