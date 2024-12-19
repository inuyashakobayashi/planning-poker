package de.dos.planningpoker.service.impl;

import de.dos.planningpoker.model.entity.UserStory;
import de.dos.planningpoker.repository.UserStoryRepository;
import de.dos.planningpoker.service.UserStoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
/**
 * Implementierung des UserStoryService-Interfaces.
 * Diese Klasse stellt die Geschäftslogik für die Verwaltung von User Stories bereit.
 */
@Service
@RequiredArgsConstructor
public class UserStoryServiceImpl implements UserStoryService {

    private final UserStoryRepository userStoryRepository;

    /**
     * Sucht eine User Story anhand ihrer ID.
     *
     * @param id Die ID der gesuchten User Story
     * @return Die gefundene User Story oder null, falls keine gefunden wurde
     */
    @Override
    public UserStory getUserStoryById(Long id) {
        return userStoryRepository.findById(id).orElse(null);
    }
    /**
     * Ruft alle User Stories aus der Datenbank ab.
     *
     * @return Eine Liste aller User Stories
     */
    @Override
    public List<UserStory> getUserStories() {
        return userStoryRepository.findAll();
    }
    /**
     * Speichert eine neue User Story in der Datenbank.
     *
     * @param userStory Die zu speichernde User Story
     * @return Die gespeicherte User Story mit generierter ID
     * @throws IllegalArgumentException wenn userStory null ist
     */
    @Override
    public UserStory saveUserStory(UserStory userStory) {
        if(userStory == null){
            throw new IllegalArgumentException("userStory cannot be null");
        }
        return userStoryRepository.save(userStory);
    }
    /**
     * Löscht eine User Story anhand ihrer ID.
     *
     * @param id Die ID der zu löschenden User Story
     * @throws EntityNotFoundException wenn keine User Story mit der angegebenen ID gefunden wurde
     */
    @Override
    public void deleteUserStoryById(Long id) {
        if(!userStoryRepository.existsById(id)) {
            throw new EntityNotFoundException("User Story not found with id " + id);
        }
        userStoryRepository.deleteById(id);
    }
    /**
     * Aktualisiert eine bestehende User Story.
     * Übernimmt Titel, Schätzung und Beschreibung aus der übergebenen User Story.
     *
     * @param id Die ID der zu aktualisierenden User Story
     * @param userStory Die User Story mit den neuen Daten
     * @return Die aktualisierte User Story
     * @throws EntityNotFoundException wenn keine User Story mit der angegebenen ID gefunden wurde
     */
    @Override
    public UserStory updateUserStoryById(Long id, UserStory userStory) {
        if(!userStoryRepository.existsById(id)) {
            throw new EntityNotFoundException("User Story not found with id " + id);
        }
        UserStory managedUserStory = this.getUserStoryById(id);
        managedUserStory.setTitle(userStory.getTitle());
        managedUserStory.setEstimation(userStory.getEstimation());
        managedUserStory.setDescription(userStory.getDescription());

        return this.saveUserStory(managedUserStory);
    }
}
