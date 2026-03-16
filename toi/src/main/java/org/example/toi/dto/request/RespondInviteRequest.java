package org.example.toi.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespondInviteRequest {
    @NotBlank(message = "Guest name is required")
    @Size(max = 100)
    private String guestName;

    private String phone;

    @Min(value = 1, message = "Guests count must be at least 1")
    private Integer guestsCount;

    private Boolean attending;

    @Size(max = 500)
    private String note;
}
