package org.example.toi.auth.dto;

import java.time.Instant;

public record ErrorResponse(
        String error,
        Instant timestamp,
        String path
) {
}
