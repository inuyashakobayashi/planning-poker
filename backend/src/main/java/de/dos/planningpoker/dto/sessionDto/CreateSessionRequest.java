package de.dos.planningpoker.dto.sessionDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateSessionRequest {
    private String userName;
    private String initialStoryTitle;
    private String initialStoryDescription;
}
