package org.example.toi.dto.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInviteRequest {
    @NotEmpty(message = "Payload is required")
    private Map<String, Object> payload;
}
