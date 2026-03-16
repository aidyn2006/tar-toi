package org.example.toi.dto.response;

import java.util.Map;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviteResponseDTO {
    private UUID id;
    private String slug;
    private Map<String, Object> payload;
    private String ownerName;
    private long responsesCount;
    @JsonProperty("isActive")
    private boolean active;
}
