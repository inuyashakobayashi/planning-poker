package de.dos.planningpoker.dto.storyDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SelectStoryRequest {
    private String sessionCode;
    private String userStoryId;
}