package org.example.toi.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record CreateInviteRequest(
    @NotBlank(message = "Title is required")
    @Size(max = 100)
    String title,

    @Size(max = 500)
    String description,

    @Min(value = 1, message = "Max guests must be at least 1")
    int maxGuests,

    @Future(message = "Event date must be in the future")
    LocalDateTime eventDate,

    String previewPhotoUrl
) {}
