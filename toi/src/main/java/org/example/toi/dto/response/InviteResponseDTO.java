package org.example.toi.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record InviteResponseDTO(
    UUID id,
    String title,
    String description,
    int maxGuests,
    LocalDateTime eventDate,
    String previewPhotoUrl,
    String ownerName,
    long responsesCount
) {}
