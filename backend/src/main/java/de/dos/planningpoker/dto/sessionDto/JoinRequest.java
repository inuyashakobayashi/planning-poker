package de.dos.planningpoker.dto.sessionDto;

import lombok.Data;

@Data
public class JoinRequest {
    private String sessionCode;
    private String userName;
}
