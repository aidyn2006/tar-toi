package org.example.toi.auth.model;

import java.util.Set;

public record JwtPrincipal(
        String phone,
        String role
) {
}
