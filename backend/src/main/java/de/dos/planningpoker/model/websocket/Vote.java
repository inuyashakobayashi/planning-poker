package de.dos.planningpoker.model.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class Vote {
    private String sessionCode;
    private String userId;
    private int estimation;
    private LocalDateTime voteTime;
}