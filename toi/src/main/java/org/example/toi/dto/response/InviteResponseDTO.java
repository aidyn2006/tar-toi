package org.example.toi.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record InviteResponseDTO(
    UUID id,
    String slug,
    String title,
    String description,
    int maxGuests,
    LocalDateTime eventDate,
    String previewPhotoUrl,
    String ownerName,
    long responsesCount,
    String topic1,
    String topic2,
    String locationName,
    String locationUrl,
    String toiOwners,
    String template,
    List<String> gallery,
    String musicUrl,
    String musicTitle
) {}
