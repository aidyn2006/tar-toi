package org.example.toi.invite.dto;

import java.time.Instant;
import java.time.LocalDate;

public record InviteView(
        String id,
        String categoryKey,
        String categoryLabel,
        String title,
        String description,
        LocalDate date,
        String time,
        String place,
        String song,
        String mapLink,
        String hosts,
        Integer maxGuests,
        String previewPhoto,
        Instant createdAt,
        Instant updatedAt
) {
}
