package de.dos.planningpoker.service;

import de.dos.planningpoker.model.entity.UserStory;

import java.util.List;

public interface UserStoryService {
    UserStory  getUserStoryById(Long id);
    List<UserStory> getUserStories();
    UserStory saveUserStory(UserStory userStory);
    void deleteUserStoryById(Long id);
    UserStory updateUserStoryById(Long id, UserStory userStory);
}
