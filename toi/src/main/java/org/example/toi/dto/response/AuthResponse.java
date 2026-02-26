package org.example.toi.dto.response;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    UserSummary user
) {
    public record UserSummary(
        Long id,
        String phone,
        String fullName,
        String role,
        boolean approved
    ) {}
}
