package org.example.toi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "invites", indexes = {
    @Index(name = "idx_invites_owner", columnList = "owner_id"),
    @Index(name = "idx_invites_slug", columnList = "slug", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invite extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(name = "preview_photo_url", length = 500)
    private String previewPhotoUrl;

    /** Optional gallery images (stored as URLs) */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "invite_gallery", joinColumns = @JoinColumn(name = "invite_id"))
    @Column(name = "photo_url", length = 500)
    @Builder.Default
    private List<String> gallery = new ArrayList<>();

    /** Unlimited when zero or negative */
    @Column(name = "max_guests", nullable = false)
    @Builder.Default
    private int maxGuests = 0;

    @Column(name = "event_date")
    private LocalDateTime eventDate;

    /** Unique slug for the public URL: /invite/{slug} */
    @Column(unique = true, length = 80)
    private String slug;

    /** Тақырып 1 — groom / bride name 1 */
    @Column(name = "topic1", length = 100)
    private String topic1;

    /** Тақырып 2 — groom / bride name 2 */
    @Column(name = "topic2", length = 100)
    private String topic2;

    /** Name of the venue / wedding hall */
    @Column(name = "location_name", length = 200)
    private String locationName;

    /** 2GIS or Google Maps URL */
    @Column(name = "location_url", length = 500)
    private String locationUrl;

    /** Той иелері — host family name */
    @Column(name = "toi_owners", length = 200)
    private String toiOwners;

    /** Chosen invite template/theme identifier */
    @Column(name = "template", length = 50)
    private String template;

    /** Optional background music */
    @Column(name = "music_url", length = 500)
    private String musicUrl;

    @Column(name = "music_title", length = 150)
    private String musicTitle;
}
