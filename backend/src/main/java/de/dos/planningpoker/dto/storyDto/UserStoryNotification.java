package de.dos.planningpoker.dto.storyDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserStoryNotification {
    private String userStoryCode;
    private String title;
    private String description;
}