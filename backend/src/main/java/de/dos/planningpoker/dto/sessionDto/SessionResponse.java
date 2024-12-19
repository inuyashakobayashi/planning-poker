package de.dos.planningpoker.dto.sessionDto;

import de.dos.planningpoker.model.websocket.PlanningPokerSession;
import lombok.Data;

@Data
public class SessionResponse extends SessionState {
    private String memberId;

    public SessionResponse(PlanningPokerSession session, String memberId) {
    super(session);
    this.memberId = memberId;
  }
}
