package org.example.toi.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

public record CreateInviteRequest(
    @NotBlank(message = "Title is required")
    @Size(max = 100)
    String title,

    @Size(max = 500)
    String description,

    @Future(message = "Event date must be in the future")
    LocalDateTime eventDate,

    String previewPhotoUrl,

    /** Optional gallery photos */
    List<String> gallery,

    /** Тақырып 1 — groom / bride name 1 */
    String topic1,

    /** Тақырып 2 — groom / bride name 2 */
    String topic2,

    /** Venue / wedding hall name */
    String locationName,

    /** 2GIS or Google Maps URL */
    String locationUrl,

    /** Той иелері — host family name */
    String toiOwners,

    /** Template/theme identifier */
    String template,

    /** Optional music file url */
    String musicUrl,

    /** Optional music title/label */
    String musicTitle,

    /** Max number of guests (0 = unlimited) */
    Integer maxGuests
) {}
