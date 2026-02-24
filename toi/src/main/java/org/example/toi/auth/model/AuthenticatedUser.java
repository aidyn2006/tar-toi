package org.example.toi.auth.model;

import java.util.Set;

public record AuthenticatedUser(
        String username,
        String fullName,
        Set<String> roles
) {
}
