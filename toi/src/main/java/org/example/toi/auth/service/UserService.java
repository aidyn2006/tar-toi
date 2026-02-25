package org.example.toi.auth.service;

import jakarta.annotation.PostConstruct;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.example.toi.auth.model.AuthenticatedUser;
import org.example.toi.auth.persistence.UserAccountEntity;
import org.example.toi.auth.persistence.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[A-Za-z0-9._-]{3,50}$");
    private static final Pattern FULL_NAME_PATTERN = Pattern.compile("^[\\p{L}][\\p{L} .'-]{1,79}$");
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final String defaultAdminUsername;
    private final String defaultAdminFullName;
    private final String defaultAdminPassword;

    public UserService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.default-admin-username:admin}") String defaultAdminUsername,
            @Value("${app.default-admin-full-name:TOI Administrator}") String defaultAdminFullName,
            @Value("${app.default-admin-password:admin123}") String defaultAdminPassword
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.defaultAdminUsername = defaultAdminUsername;
        this.defaultAdminFullName = defaultAdminFullName;
        this.defaultAdminPassword = defaultAdminPassword;
    }

    @PostConstruct
    void initDefaultAdmin() {
        registerInternal(
                defaultAdminFullName,
                defaultAdminUsername,
                defaultAdminPassword,
                Set.of("ROLE_ADMIN", "ROLE_USER"),
                true
        );
    }

    @Transactional
    public AuthenticatedUser register(String fullName, String username, String password, String confirmPassword) {
        if (!Objects.equals(password, confirmPassword)) {
            throw new IllegalArgumentException("Пароли не совпадают");
        }
        return registerInternal(fullName, username, password, Set.of("ROLE_USER"), false);
    }

    @Transactional(readOnly = true)
    public AuthenticatedUser authenticate(String username, String password) {
        validateUsername(username);
        validatePassword(password);

        UserAccountEntity user = userAccountRepository.findByUsernameNormalized(normalizeUsername(username))
                .orElse(null);
        if (user == null || !user.getPasswordHash().equals(password)) {
            throw new BadCredentialsException("Неверный логин или пароль");
        }
        return toAuthenticated(user);
    }

    @Transactional(readOnly = true)
    public Optional<AuthenticatedUser> findByUsername(String username) {
        if (username == null || username.isBlank()) {
            return Optional.empty();
        }

        return userAccountRepository.findByUsernameNormalized(normalizeUsername(username))
                .map(this::toAuthenticated);
    }

    @Transactional(readOnly = true)
    public Set<AuthenticatedUser> findAll() {
        return userAccountRepository.findAll().stream()
                .map(this::toAuthenticated)
                .collect(Collectors.toUnmodifiableSet());
    }

    @Transactional
    public AuthenticatedUser approveUser(String username) {
        String normalized = normalizeUsername(username);
        UserAccountEntity user = userAccountRepository.findByUsernameNormalized(normalized)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
        user.setApproved(true);
        UserAccountEntity saved = userAccountRepository.saveAndFlush(user);
        return toAuthenticated(saved);
    }

    private AuthenticatedUser registerInternal(
            String fullName,
            String username,
            String password,
            Set<String> roles,
            boolean skipIfExists
    ) {
        validateFullName(fullName);
        validateUsername(username);
        validatePassword(password);

        String normalizedUsername = normalizeUsername(username);
        Optional<UserAccountEntity> existing = userAccountRepository.findByUsernameNormalized(normalizedUsername);
        if (existing.isPresent()) {
            if (skipIfExists) {
                return toAuthenticated(existing.get());
            }
            throw new IllegalStateException("Пользователь уже существует");
        }

        UserAccountEntity entity = new UserAccountEntity();
        entity.setUsername(username.trim());
        entity.setUsernameNormalized(normalizedUsername);
        entity.setFullName(normalizeFullName(fullName));
        entity.setPasswordHash(password);
        entity.setRoles(normalizeRoles(roles));
        // новые пользователи неапрувнуты; админ по умолчанию апрувнут
        entity.setApproved(entity.getRoles().contains("ROLE_ADMIN"));

        try {
            UserAccountEntity saved = userAccountRepository.saveAndFlush(entity);
            return toAuthenticated(saved);
        } catch (DataIntegrityViolationException ex) {
            if (skipIfExists) {
                return userAccountRepository.findByUsernameNormalized(normalizedUsername)
                        .map(this::toAuthenticated)
                        .orElseThrow(() -> ex);
            }
            throw new IllegalStateException("Пользователь уже существует");
        }
    }

    private String normalizeUsername(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeFullName(String fullName) {
        return fullName.trim().replaceAll("\\s+", " ");
    }

    private void validateFullName(String fullName) {
        String value = fullName == null ? "" : normalizeFullName(fullName);
        if (!FULL_NAME_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Имя должно быть от 2 до 80 символов");
        }
    }

    private void validateUsername(String username) {
        String value = username == null ? "" : username.trim();
        if (!USERNAME_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Логин должен содержать 3-50 символов: буквы, цифры, ., _, -");
        }
    }

    private void validatePassword(String password) {
        int length = password == null ? 0 : password.length();
        if (length < 6 || length > 100) {
            throw new IllegalArgumentException("Пароль должен быть от 6 до 100 символов");
        }
    }

    private Set<String> normalizeRoles(Set<String> roles) {
        return roles.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(role -> !role.isEmpty())
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private AuthenticatedUser toAuthenticated(UserAccountEntity user) {
        return new AuthenticatedUser(
                user.getUsername(),
                user.getFullName(),
                Set.copyOf(user.getRoles()),
                Boolean.TRUE.equals(user.getApproved())
        );
    }
}
