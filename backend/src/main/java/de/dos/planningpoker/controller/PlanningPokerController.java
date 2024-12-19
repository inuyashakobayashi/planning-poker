package de.dos.planningpoker.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import de.dos.planningpoker.dto.ErrorResponse;
import de.dos.planningpoker.dto.sessionDto.CloseSessionRequest;
import de.dos.planningpoker.dto.sessionDto.CreateSessionRequest;
import de.dos.planningpoker.dto.sessionDto.JoinRequest;
import de.dos.planningpoker.dto.sessionDto.LeaveRequest;
import de.dos.planningpoker.dto.sessionDto.ReconnectRequest;
import de.dos.planningpoker.dto.sessionDto.SessionRequest;
import de.dos.planningpoker.dto.sessionDto.SessionResponse;
import de.dos.planningpoker.dto.sessionDto.SessionState;
import de.dos.planningpoker.dto.storyDto.AcceptStoryRequest;
import de.dos.planningpoker.dto.storyDto.AddStoryRequest;
import de.dos.planningpoker.dto.storyDto.DeleteStoryRequest;
import de.dos.planningpoker.dto.storyDto.ResetStoryRequest;
import de.dos.planningpoker.dto.storyDto.SelectStoryRequest;
import de.dos.planningpoker.dto.storyDto.UpdateStoryRequest;
import de.dos.planningpoker.dto.storyDto.VoteStoryRequest;
import de.dos.planningpoker.model.websocket.PlanningPokerSession;
import de.dos.planningpoker.model.websocket.User;
import de.dos.planningpoker.service.impl.SessionServiceImpl;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class PlanningPokerController {
    private final SimpMessagingTemplate messagingTemplate;
    private final SessionServiceImpl sessionService;

    @MessageMapping("/poker/create")
    @SendTo("/topic/session/created")
    public SessionResponse createSession(CreateSessionRequest createSessionRequest) {
        SessionResponse response = sessionService.createSession(createSessionRequest);
        sendSessionsList();
        return response;
    }

    @MessageMapping("/poker/join")
    @SendTo("/topic/session/joined")
    public SessionResponse join(JoinRequest joinRequest) {
        SessionResponse response = sessionService.joinSession(joinRequest);
        sendSessionState(joinRequest.getSessionCode());
        return response;
    }

    @MessageMapping("/poker/reconnect")
    @SendTo("/topic/session/reconnected")
    public SessionState reconnect(ReconnectRequest request) {
        PlanningPokerSession session = sessionService.getActiveSession(request.getSessionCode());
        if (session == null || !session.isActive()) {
            return null;
        }
        User user = session.getUsers().get(request.getUserId());
        if (user == null) {
            return null;
        }

        sendSessionState(session.getId());
        return new SessionState(session);
    }

    @MessageMapping("/poker/leave")
    public void leave(LeaveRequest request) {
        PlanningPokerSession session = sessionService.getActiveSession(request.getSessionCode());
        if (session == null || !session.isActive()) {
            return;
        }
        User user = session.getUsers().get(request.getUserId());
        if (user == null) {
            return;
        }
        session.removeUser(user.getId());
        sendSessionState(session.getId());
    }

    @MessageMapping("/poker/close")
    public void closeSession(CloseSessionRequest request) {
        PlanningPokerSession session = sessionService.getActiveSession(request.getSessionCode());
        if (session == null || !session.isActive()) {
            return;
        }

        if (!session.getScrumMasterId().equals(request.getUserId())) {
            sendErrorToUser(request.getUserId(), "Only Scrum Master can close the session");
            return;
        }

        // Service kümmert sich um Datenbankpersistenz und Entfernen der Session
        sessionService.removeSession(request.getSessionCode());

        sendSessionState(request.getSessionCode());
    }

    // ----------------------------------------------------------------------------------------------

    @MessageMapping("/poker/session/ids/get")
    @SendTo("/topic/session/ids")
    public List<String> getSessionIds() {
        try {
            List<String> activeIds = sessionService.getActiveSessionCodes();
            return activeIds;
        } catch (Exception e) {
            System.err.println("BE: Error getting session IDs: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // ----------------------------------------------------------------------------------------------

    @MessageMapping("/poker/story/add")
    public void addUserStory(AddStoryRequest request) {
        sessionService.addUserStory(request.getSessionCode(), request);
        sendSessionState(request.getSessionCode());
    }

    @MessageMapping("/poker/story/update")
    public void updateUserStory(UpdateStoryRequest request) {
        sessionService.updateUserStory(request.getSessionCode(), request);
        sendSessionState(request.getSessionCode());
    }

    @MessageMapping("/poker/story/delete")
    public void deleteUserStory(DeleteStoryRequest request) {
        sessionService.removeUserStory(request.getSessionCode(), request.getUserStoryId());
        sendSessionState(request.getSessionCode());
    }

    @MessageMapping("/poker/story/select")
    public void selectUserStory(SelectStoryRequest request) {
        sessionService.selectUserStory(request.getSessionCode(), request.getUserStoryId());
        sendSessionState(request.getSessionCode());
    }

    // ----------------------------------------------------------------------------------------------

    @MessageMapping("/poker/story/vote")
    public void voteUserStory(VoteStoryRequest request) {
        sessionService.voteUserStory(request);
        sendSessionState(request.getSessionCode());
    }

    @MessageMapping("/poker/story/reveal")
    public void revealStoryVotes(SessionRequest request) {
        sessionService.revealSessionVotes(request.getSessionCode());
        sendSessionState(request.getSessionCode());
    }

    @MessageMapping("/poker/story/reset")
    public void resetStory(ResetStoryRequest request) {
        sessionService.resetUserStory(request.getSessionCode(), request.getUserStoryId());
        sendSessionState(request.getSessionCode());
    }

    @MessageMapping("/poker/story/accept")
    public void acceptStoryVotes(AcceptStoryRequest request) {
        sessionService.acceptUserStory(request.getSessionCode(), request.getUserStoryId(), request.getEstimate());
        sendSessionState(request.getSessionCode());
    }

    // ----------------------------------------------------------------------------------------------

    private void sendErrorToUser(String userId, String message) {
        messagingTemplate.convertAndSendToUser(userId, "queue/errors", new ErrorResponse(message));
    }

    private void sendSessionState(String sessionCode) {
        PlanningPokerSession session = sessionService.getActiveSession(sessionCode);
        if (session == null) {
            SessionState sessionState = new SessionState();
            messagingTemplate.convertAndSend("/topic/session/" + sessionCode + "/state", sessionState);
            return;
        }
        SessionState sessionState = new SessionState(session);
        messagingTemplate.convertAndSend("/topic/session/" + sessionCode + "/state", sessionState);
    }

    private void sendSessionsList() {
        List<String> activeIds = sessionService.getActiveSessionCodes();
        messagingTemplate.convertAndSend("/topic/session/ids", activeIds);
    }
}
