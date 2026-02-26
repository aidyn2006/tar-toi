package org.example.toi.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RespondInviteRequest(
    @NotBlank(message = "Guest name is required")
    @Size(max = 100)
    String guestName,

    String phone,

    @Min(value = 1, message = "Guests count must be at least 1")
    int guestsCount,

    boolean attending
) {}
