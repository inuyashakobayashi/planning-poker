package de.dos.planningpoker.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.dos.planningpoker.dto.sessionDto.CreateSessionRequest;
import de.dos.planningpoker.dto.sessionDto.JoinRequest;
import de.dos.planningpoker.dto.sessionDto.SessionResponse;
import de.dos.planningpoker.dto.sessionDto.SessionState;
import de.dos.planningpoker.dto.storyDto.AddStoryRequest;
import de.dos.planningpoker.dto.storyDto.UpdateStoryRequest;
import de.dos.planningpoker.dto.storyDto.VoteStoryRequest;
import de.dos.planningpoker.enumeration.Role;
import de.dos.planningpoker.model.entity.Session;
import de.dos.planningpoker.model.entity.UserStory;
import de.dos.planningpoker.model.websocket.PlanningPokerSession;
import de.dos.planningpoker.model.websocket.Story;
import de.dos.planningpoker.model.websocket.User;
import de.dos.planningpoker.model.websocket.Vote;
import de.dos.planningpoker.repository.SessionRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional
public class SessionServiceImpl {

    private final SessionRepository sessionRepository;
    private final Map<String, PlanningPokerSession> activeSessions = new ConcurrentHashMap<>();

    public SessionResponse createSession(CreateSessionRequest request) {
        try {
            // Generate session code
            String sessionCode = UUID.randomUUID().toString().substring(0, 8);

            // Create WebSocket session
            PlanningPokerSession wsSession = new PlanningPokerSession(sessionCode);

            // Create Scrum Master
            User scrumMaster = new User(
                    UUID.randomUUID().toString(),
                    request.getUserName(),
                    Role.SCRUM_MASTER,
                    sessionCode
            );

            // Add initial user story if provided
            if (request.getInitialStoryTitle() != null && !request.getInitialStoryTitle().trim().isEmpty()) {
                String storyId = UUID.randomUUID().toString().substring(0, 8);
                Story story = new Story(
                        storyId,
                        request.getInitialStoryTitle(),
                        request.getInitialStoryDescription(),
                        false,0
                );
                wsSession.putUserStory(story);
                wsSession.setCurrentUserStory(storyId);
            }

            // Add Scrum Master to session and store in memory
            wsSession.addUser(scrumMaster);
            activeSessions.put(sessionCode, wsSession);

            // Return response
            return new SessionResponse(wsSession, scrumMaster.getId());
        } catch (Exception e) {
            System.err.println("Error creating session: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create session", e);
        }
    }
    public SessionResponse joinSession(JoinRequest request) {
        try {
            // 1. Validiere und hole Session
            PlanningPokerSession wsSession = getSessionByCode(request.getSessionCode());

            // 2. Erstelle neuen User
            User newUser = new User(
                    UUID.randomUUID().toString(),
                    request.getUserName(),
                    Role.TEAM_MEMBER,
                    request.getSessionCode());

            // 3. Füge User zur Session hinzu
            wsSession.addUser(newUser);
            return new SessionResponse(wsSession, newUser.getId());
        } catch (Exception e) {
            System.err.println("Error in joinSession: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to join session", e);
        }
    }


    public void removeSession(String sessionCode) {
        try {
            // Hole die Session aus dem Speicher
            PlanningPokerSession wsSession = activeSessions.get(sessionCode);
            if (wsSession != null) {
                // Erstelle Session Entity
                Session sessionEntity = new Session();
                sessionEntity.setSessionCode(sessionCode);
                sessionEntity.setActive(false);

                // Kopiere nur User Stories mit Schätzung > 0
                for (Story wsStory : wsSession.getUserStories().values()) {
                    // Prüfe ob die Schätzung größer als 0 ist
                    if (wsStory.getEstimate() > 0) {
                        UserStory storyEntity = new UserStory();
                        storyEntity.setTitle(wsStory.getTitle());

                        // Sanitize HTML content before saving
                        String sanitizedDescription = "";
                        if (wsStory.getDescription() != null) {
                            // Erlaubt basic HTML-Formatierung aber entfernt potenziell gefährliche Elemente
                            sanitizedDescription = Jsoup.clean(
                                    wsStory.getDescription(),
                                    Safelist.basic()
                                            .addTags("div", "span", "p", "br", "ul", "ol", "li")
                                            .addAttributes("span", "style")
                                            .addAttributes("p", "style")
                            );
                        }
                        storyEntity.setDescription(sanitizedDescription);

                        storyEntity.setEstimation(wsStory.getEstimate());
                        // Verknüpfe Story mit Session
                        sessionEntity.addUserStory(storyEntity);
                    }
                }

                // Speichere alles in der Datenbank, nur wenn es User Stories gibt
                if (!sessionEntity.getUserStories().isEmpty()) {
                    sessionRepository.save(sessionEntity);
                }

                // Zum Schluss aus dem Speicher entfernen
                activeSessions.remove(sessionCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to remove and save session: " + e.getMessage(), e);
        }
    }
    // ----------------------------------------------------------------------------------------------
    public List<String> getActiveSessionCodes() {
        try {

            return activeSessions.keySet().stream().toList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public PlanningPokerSession getSessionByCode(String sessionCode) {
        PlanningPokerSession wsSession = activeSessions.get(sessionCode);
        if (wsSession == null) {
            throw new IllegalArgumentException("Session not found: " + sessionCode);
        }
        return wsSession;
    }

    public PlanningPokerSession getActiveSession(String sessionCode) {
        return activeSessions.get(sessionCode);
    }

    public SessionState getSessionState(String sessionCode) {
        PlanningPokerSession wsSession = getSessionByCode(sessionCode);
        return new SessionState(wsSession);
    }

    // ----------------------------------------------------------------------------------------------
    public void addUserStory(String sessionCode, AddStoryRequest storyRequest) {
        PlanningPokerSession wsSession = getSessionByCode(sessionCode);

        String storyId = UUID.randomUUID().toString().substring(0, 8);
        Story story = new Story(storyId, storyRequest.getTitle(), storyRequest.getDescription(), false,0);
        wsSession.putUserStory(story);
    }

    public void updateUserStory(String sessionCode, UpdateStoryRequest storyRequest) {
        PlanningPokerSession wsSession = getSessionByCode(sessionCode);

        Story story = new Story(storyRequest.getUserStoryId(), storyRequest.getTitle(), storyRequest.getDescription(),
                false,0);
        wsSession.putUserStory(story);
    }

    public void removeUserStory(String sessionCode, String storyId) {
        PlanningPokerSession wsSession = getSessionByCode(sessionCode);
        wsSession.removeUserStory(storyId);
    }

    public void selectUserStory(String sessionCode, String storyId) {
        PlanningPokerSession wsSession = getSessionByCode(sessionCode);
        wsSession.setCurrentUserStory(storyId);
    }

    public void acceptUserStory(String sessionCode, String storyId, int estimate ) {
        PlanningPokerSession wsSession = getSessionByCode(sessionCode);
        Story selectedStory = wsSession.getUserStories().get(storyId);
        selectedStory.setEstimate(estimate);
    }

    public void resetUserStory(String sessionCode, String storyId) {
        PlanningPokerSession wsSession = getSessionByCode(sessionCode);
        Story selectedStory = wsSession.getUserStories().get(storyId);
        selectedStory.setEstimate(0);
        wsSession.resetRound();
    }

    public void voteUserStory(VoteStoryRequest request) {
        PlanningPokerSession wsSession = getSessionByCode(request.getSessionCode());

        Vote vote = new Vote(request.getSessionCode(), request.getUserId(), request.getEstimate(), LocalDateTime.now());
        wsSession.addVote(vote);
    }

    public void revealSessionVotes(String sessionCode) {
        PlanningPokerSession wsSession = getSessionByCode(sessionCode);
        wsSession.revealVotes();
    }
    
}
