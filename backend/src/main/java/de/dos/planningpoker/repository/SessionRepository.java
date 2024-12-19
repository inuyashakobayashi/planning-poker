package de.dos.planningpoker.repository;

import de.dos.planningpoker.model.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findBySessionCode(String sessionCode);
    @Query("SELECT s FROM Session s WHERE s.active = true")
    List<Session> findByActiveTrue();

}
