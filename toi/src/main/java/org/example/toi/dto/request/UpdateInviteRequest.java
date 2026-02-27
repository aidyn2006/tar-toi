package org.example.toi.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

public record UpdateInviteRequest(
    @Size(max = 100)
    String title,

    @Size(max = 500)
    String description,

    /** Zero or negative means unlimited */
    Integer maxGuests,

    LocalDateTime eventDate,

    String previewPhotoUrl,

    List<String> gallery,

    String topic1,

    String topic2,

    String locationName,

    String locationUrl,

    String toiOwners,

    String template,

    String musicUrl,

    String musicTitle
) {}
