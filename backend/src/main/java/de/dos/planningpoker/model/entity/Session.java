package de.dos.planningpoker.model.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "session")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String sessionCode;  // UUID für Frontend-Referenz

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<UserStory> userStories = new ArrayList<>();

    @Column(nullable = false)
    private boolean active = true;
    public void addUserStory(UserStory story) {
        if (userStories == null) {
            userStories = new ArrayList<>();
        }
        userStories.add(story);
        story.setSession(this);
    }
}