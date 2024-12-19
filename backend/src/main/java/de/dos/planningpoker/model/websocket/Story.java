package de.dos.planningpoker.model.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Story {
    private String id;
    private String title;
    private String description;
    private boolean accepted;
    private int estimate;
}
