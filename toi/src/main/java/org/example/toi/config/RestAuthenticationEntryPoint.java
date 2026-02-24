package org.example.toi.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        String message = (String) request.getAttribute("jwt_error");
        if (message == null || message.isBlank()) {
            message = "Требуется авторизация";
        }
        writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, message, request.getRequestURI());
    }

    private void writeJson(
            HttpServletResponse response,
            int status,
            String message,
            String path
    ) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                "{\"error\":\"" + escapeJson(message) + "\","
                        + "\"timestamp\":\"" + Instant.now() + "\","
                        + "\"path\":\"" + escapeJson(path) + "\"}"
        );
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
