package org.example.toi.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import org.example.toi.auth.model.AuthenticatedUser;
import org.example.toi.auth.model.JwtPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
public class JwtService {
    private static final String ROLES_CLAIM = "role";
    private final String secret;
    private final long expirationMinutes;
    private final String issuer;
    private SecretKey signingKey;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-minutes:120}") long expirationMinutes,
            @Value("${jwt.issuer:toi-api}") String issuer
    ) {
        this.secret = secret;
        this.expirationMinutes = expirationMinutes;
        this.issuer = issuer;
    }

    @PostConstruct
    void init() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT secret должен быть не короче 32 символов");
        }
        if (expirationMinutes <= 0) {
            throw new IllegalStateException("JWT expiration-minutes должен быть больше 0");
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String createAccessToken(AuthenticatedUser user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(expirationMinutes, ChronoUnit.MINUTES);

        return Jwts.builder()
                .issuer(issuer)
                .subject(user.username())
                .issuedAt(java.util.Date.from(now))
                .expiration(java.util.Date.from(expiresAt))
                .claim(ROLES_CLAIM, user.role())
                .signWith(signingKey)
                .compact();
    }

    public JwtPrincipal parse(String token) {
        if (token == null || token.isBlank()) {
            throw new JwtException("Пустой токен");
        }

        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String username = claims.getSubject();
        if (username == null || username.isBlank()) {
            throw new JwtException("Токен не содержит subject");
        }

        return new JwtPrincipal(username, (String) claims.get(ROLES_CLAIM));
    }

    public long getExpirationSeconds() {
        return expirationMinutes * 60;
    }


}
