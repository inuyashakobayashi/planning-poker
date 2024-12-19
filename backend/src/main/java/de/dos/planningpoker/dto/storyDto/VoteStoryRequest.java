package de.dos.planningpoker.dto.storyDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VoteStoryRequest {
    private String sessionCode;
    private String userId;
    private int estimate;
}