package org.example.toi.dto.response;

import java.time.Instant;

public record ErrorResponse(
    String message,
    Instant timestamp,
    String path
) {}
