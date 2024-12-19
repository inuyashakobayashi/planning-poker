package de.dos.planningpoker.model.websocket;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import de.dos.planningpoker.enumeration.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class PlanningPokerSession {
    private final String id; // sessionCode
    private Long databaseId; // neue Feld für DB-Referenz
    private String scrumMasterId;
    private String scrumMasterName;
    private Map<String, User> users = new ConcurrentHashMap<>();
    private boolean active = true; // direkt initialisieren
    
    // UserStory Management
    private Map<String, Story> userStories = new ConcurrentHashMap<>();
    private List<Vote> sessionVotes = new ArrayList<>();
    private boolean votesRevealed = false;
    private LocalDateTime roundStart = LocalDateTime.now();
    private LocalDateTime roundEnd;
    private String currentUserStoryId;

    // Constructor können wir vereinfachen, da @RequiredArgsConstructor das handled
    // und active bereits initialisiert ist

    public void addUser(User user) {
        if (user.getRole() == Role.SCRUM_MASTER) {
            if (scrumMasterId != null && !user.getId().equals(scrumMasterId)) {
                throw new IllegalStateException("Session already has a Scrum Master");
            }
            this.scrumMasterId = user.getId();
        }
        users.put(user.getId(), user);
    }

    public void removeUser(String id) {
        if (id.equals(scrumMasterId)) {
            scrumMasterId = null; // Scrum Master ID zurücksetzen wenn der Scrum Master geht
        }
        users.remove(id);
    }

    // UserStory Management using Map
    public void setCurrentUserStory(String storyId) {
        this.currentUserStoryId = storyId;
        resetRound();
    }

    public void acceptUserStory(String storyId, int estimate) {
        Story story = userStories.get(storyId);
        story.setEstimate(estimate);
        story.setAccepted(true);
        resetRound();
    }

    public void putUserStory(Story userStory) {
        if (userStory.getId() == null) {
            throw new IllegalArgumentException("UserStory must have a valid ID");
        }
        userStories.put(userStory.getId(), userStory);
    }

    public Story getUserStoryById(String storyId) {
        return userStories.get(storyId);
    }

    public void removeUserStory(String storyId) {
        if (currentUserStoryId.equals(storyId)) {
            currentUserStoryId = null; // Reset current story if it's being removed
            resetRound();
        }
        userStories.remove(storyId);
    }

    public void addVote(Vote vote) {
        sessionVotes.removeIf(existingVote -> existingVote.getUserId().equals(vote.getUserId()));
        sessionVotes.add(vote);
    }

    public void revealVotes() {
        votesRevealed = true;
        roundEnd = LocalDateTime.now();
    }

    public boolean getRevealStatus() {
        return votesRevealed;
    }

    // Getter für databaseId
    public Long getDatabaseId() {
        return databaseId;
    }

    // Setter für databaseId
    public void setDatabaseId(Long databaseId) {
        this.databaseId = databaseId;
    }

    public void resetRound(){
        sessionVotes.clear();
        votesRevealed = false;
        roundStart = LocalDateTime.now();
        roundEnd = null;
    }
}
