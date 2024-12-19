package de.dos.planningpoker.controller;

import de.dos.planningpoker.model.entity.UserStory;
import de.dos.planningpoker.service.UserStoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
/**
 * REST Controller für die Verwaltung von User Stories im Planning Poker System.
 * Stellt Endpunkte für CRUD-Operationen (Create, Read, Update, Delete) von User Stories bereit.
 */
@Controller
@RequiredArgsConstructor
public class UserStoryController {

    private final UserStoryService userStoryService;

    private final SimpMessagingTemplate messagingTemplate;


    // Subscribe to get all user stories
    @MessageMapping("/userstories/getAll")
    @SendTo("/topic/userstories")
    public List<UserStory> getUserStories() {
        return userStoryService.getUserStories();
    }

    // Subscribe to get a specific user story
    @MessageMapping("/userstories/get/{id}")
    @SendTo("/topic/userstory/{id}")
    public UserStory getUserStory(@DestinationVariable Long id) {
        return userStoryService.getUserStoryById(id);
    }

    // Add new user story
    @MessageMapping("/userstories/add")
    public void addUserStory(UserStory userStory) {
        UserStory savedStory = userStoryService.saveUserStory(userStory);
        // Broadcast the new user story to all subscribers
        messagingTemplate.convertAndSend("/topic/userstories/new", savedStory);
        // Also update the full list
        messagingTemplate.convertAndSend("/topic/userstories",
                userStoryService.getUserStories());
    }

    // Update existing user story
    @MessageMapping("/userstories/update/{id}")
    public void updateUserStory(@DestinationVariable Long id, UserStory userStory) {
        UserStory updatedStory = userStoryService.updateUserStoryById(id, userStory);
        // Broadcast the updated user story
        messagingTemplate.convertAndSend("/topic/userstories/updated", updatedStory);
        // Update the specific story topic
        messagingTemplate.convertAndSend("/topic/userstory/" + id, updatedStory);
        // Also update the full list
        messagingTemplate.convertAndSend("/topic/userstories",
                userStoryService.getUserStories());
    }

    // Delete user story
    @MessageMapping("/userstories/delete/{id}")
    public void deleteUserStory(@DestinationVariable Long id) {
        userStoryService.deleteUserStoryById(id);
        // Broadcast the deletion
        messagingTemplate.convertAndSend("/topic/userstories/deleted", id);
        // Also update the full list
        messagingTemplate.convertAndSend("/topic/userstories",
                userStoryService.getUserStories());
    }
}


