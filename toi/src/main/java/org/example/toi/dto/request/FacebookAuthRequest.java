package org.example.toi.dto.request;

import jakarta.validation.constraints.NotBlank;

public record FacebookAuthRequest(
    @NotBlank(message = "Facebook access token is required")
    String accessToken
) {}
