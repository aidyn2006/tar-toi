package org.example.toi.invite.dto;

import java.util.List;

public record InviteStatsResponse(
        String inviteId,
        int yesCount,
        int maybeCount,
        int noCount,
        int totalGuests,
        List<InviteResponseItem> recentResponses
) {
}
