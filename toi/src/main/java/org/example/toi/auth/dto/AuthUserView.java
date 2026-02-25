package org.example.toi.auth.dto;

import java.util.Set;

public record AuthUserView(
        String username,
        String fullName,
        Set<String> roles,
        boolean approved
) {
}
