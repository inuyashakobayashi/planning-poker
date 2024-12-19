package de.dos.planningpoker.dto.storyDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AcceptStoryRequest {
    private String sessionCode;
    private String userStoryId;
    private int estimate;
}
