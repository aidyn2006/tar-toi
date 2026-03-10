package org.example.toi.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ThreadsAuthRequest(
    @NotBlank(message = "OAuth code is required")
    String code
) {}
