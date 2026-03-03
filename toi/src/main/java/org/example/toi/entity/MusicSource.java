package org.example.toi.entity;

/**
 * Indicates where the music comes from.
 * SYSTEM  — built-in preset track referenced by key.
 * UPLOAD  — user-uploaded file stored under /uploads.
 */
public enum MusicSource {
    SYSTEM,
    UPLOAD;

    public static MusicSource fromString(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return MusicSource.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
