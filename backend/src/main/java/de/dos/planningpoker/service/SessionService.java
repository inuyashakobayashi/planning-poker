package de.dos.planningpoker.service;

import de.dos.planningpoker.model.entity.Session;
import java.util.List;

public interface SessionService {
    Session save(Session session);
    List<Session> getAll();
}
