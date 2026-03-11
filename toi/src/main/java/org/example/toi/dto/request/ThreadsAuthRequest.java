package org.example.toi.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ThreadsAuthRequest(
        @NotBlank String code
) {}
