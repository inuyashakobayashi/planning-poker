package de.dos.planningpoker.dto.sessionDto;
import lombok.Data;

@Data
public class ReconnectRequest {
    private String sessionCode;
    String userId;
}
