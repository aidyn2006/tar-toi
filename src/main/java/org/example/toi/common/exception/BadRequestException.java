package org.example.toi.common.exception;

/** Thrown when request data is syntactically valid but semantically incorrect. */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
