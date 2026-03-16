package org.example.toi.common.exception;

/** Thrown when an action conflicts with the current state (e.g., capacity reached). */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
