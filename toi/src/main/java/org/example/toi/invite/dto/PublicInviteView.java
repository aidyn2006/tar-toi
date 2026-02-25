package org.example.toi.invite.dto;

import java.time.LocalDate;

public record PublicInviteView(
        String id,
        String categoryLabel,
        String title,
        String description,
        LocalDate date,
        String time,
        String place,
        String mapLink,
        String hosts,
        Integer maxGuests,
        String previewPhoto
) {
}
