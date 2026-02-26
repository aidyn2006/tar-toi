package org.example.toi.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record UpdateInviteRequest(
    @Size(max = 100)
    String title,

    @Size(max = 500)
    String description,

    @Min(value = 1, message = "Max guests must be at least 1")
    int maxGuests,

    LocalDateTime eventDate,

    String previewPhotoUrl,

    String topic1,

    String topic2,

    String locationName,

    String locationUrl,

    String toiOwners,

    String template
) {}
