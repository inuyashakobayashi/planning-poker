package de.dos.planningpoker.dto.sessionDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CloseSessionRequest {
    private String sessionCode;
    private String userId;
}
