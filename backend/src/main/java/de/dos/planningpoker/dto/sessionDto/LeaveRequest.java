package de.dos.planningpoker.dto.sessionDto;

import lombok.Data;

@Data
public class LeaveRequest {
    private String sessionCode;
    String userId;
}
