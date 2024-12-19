package de.dos.planningpoker.model.websocket;

import de.dos.planningpoker.enumeration.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class User {
    private String id;
    private String name;
    private Role role;
    private String sessionId;
}
