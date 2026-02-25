package org.example.toi.invite.dto;

import java.time.Instant;

public record InviteResponseItem(
        String name,
        String phone,
        Integer guests,
        String status,
        String note,
        Instant createdAt
) {
}
