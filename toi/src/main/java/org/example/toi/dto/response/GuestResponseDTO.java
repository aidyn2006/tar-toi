package org.example.toi.dto.response;

import java.time.LocalDateTime;

public record GuestResponseDTO(
    Long id,
    String guestName,
    String phone,
    int guestsCount,
    boolean attending,
    LocalDateTime createdAt
) {}
