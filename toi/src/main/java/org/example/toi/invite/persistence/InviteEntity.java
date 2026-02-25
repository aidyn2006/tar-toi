package org.example.toi.invite.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "invites")
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public String getOwnerUsernameNormalized() {
        return ownerUsernameNormalized;
    }

    public void setOwnerUsernameNormalized(String ownerUsernameNormalized) {
        this.ownerUsernameNormalized = ownerUsernameNormalized;
    }

    public String getCategoryKey() {
        return categoryKey;
    }

    public void setCategoryKey(String categoryKey) {
        this.categoryKey = categoryKey;
    }

    public String getCategoryLabel() {
        return categoryLabel;
    }

    public void setCategoryLabel(String categoryLabel) {
        this.categoryLabel = categoryLabel;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String getSong() {
        return song;
    }

    public void setSong(String song) {
        this.song = song;
    }

    public String getMapLink() {
        return mapLink;
    }

    public void setMapLink(String mapLink) {
        this.mapLink = mapLink;
    }

    public String getHosts() {
        return hosts;
    }

    public void setHosts(String hosts) {
        this.hosts = hosts;
    }

    public Integer getMaxGuests() {
        return maxGuests;
    }

    public void setMaxGuests(Integer maxGuests) {
        this.maxGuests = maxGuests;
    }

    public String getPreviewPhoto() {
        return previewPhoto;
    }

    public void setPreviewPhoto(String previewPhoto) {
        this.previewPhoto = previewPhoto;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
