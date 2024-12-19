package de.dos.planningpoker.repository;

import de.dos.planningpoker.model.entity.UserStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, Long> {
}
