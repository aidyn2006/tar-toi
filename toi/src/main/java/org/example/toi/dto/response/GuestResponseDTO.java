package org.example.toi.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestResponseDTO {
    private Long id;
    private String guestName;
    private String phone;
    private int guestsCount;
    private boolean attending;
    private String note;
    private LocalDateTime createdAt;
}
