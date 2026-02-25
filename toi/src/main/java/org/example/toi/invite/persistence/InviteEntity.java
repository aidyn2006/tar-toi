package org.example.toi.invite.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "invites")
@Getter
@Setter
public class InviteEntity {

    @Id
    @Column(name = "id", nullable = false, length = 64)
    private String id;

    @Column(name = "owner_username", nullable = false, length = 50)
    private String ownerUsername;

    @Column(name = "owner_username_normalized", nullable = false, length = 50)
    private String ownerUsernameNormalized;

    @Column(name = "category_key", nullable = false, length = 32)
    private String categoryKey;

    @Column(name = "category_label", nullable = false, length = 80)
    private String categoryLabel;

    @Column(name = "title", nullable = false, length = 140)
    private String title;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "event_time", length = 10)
    private String eventTime;

    @Column(name = "place_name", length = 200)
    private String place;

    @Column(name = "song", length = 60)
    private String song;

    @Column(name = "map_link", length = 300)
    private String mapLink;

    @Column(name = "hosts", length = 160)
    private String hosts;

    @Column(name = "max_guests")
    private Integer maxGuests;

    @Lob
    @Column(name = "preview_photo")
    private String previewPhoto;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
