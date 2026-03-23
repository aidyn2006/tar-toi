package org.example.toi.common.exception;

/** Thrown when the current principal is not allowed to perform an action. */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
