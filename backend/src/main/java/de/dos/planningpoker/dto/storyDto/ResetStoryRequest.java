package de.dos.planningpoker.dto.storyDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResetStoryRequest {
    private String sessionCode;
    private String userStoryId;
}
