package de.dos.planningpoker.dto.storyDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddStoryRequest {
    private String sessionCode;
    private String title;
    private String description;
}
