package org.example.toi.auth.service;

import jakarta.annotation.PostConstruct;
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
    private static final Pattern FULL_NAME_PATTERN = Pattern.compile("^[\\p{L}][\\p{L} .'-]{1,79}$");
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final String defaultAdminPhone;
    private final String defaultAdminFullName;
    private final String defaultAdminPassword;

    public UserService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.default-admin-phone:${app.default-admin-username:admin}}") String defaultAdminPhone,
            @Value("${app.default-admin-full-name:TOI Administrator}") String defaultAdminFullName,
            @Value("${app.default-admin-password:admin123}") String defaultAdminPassword
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.defaultAdminPhone = defaultAdminPhone;
        this.defaultAdminFullName = defaultAdminFullName;
        this.defaultAdminPassword = defaultAdminPassword;
    }

    @PostConstruct
    void initDefaultAdmin() {
        registerInternal(
                defaultAdminFullName,
                defaultAdminPhone,
                defaultAdminPassword,
                "ROLE_ADMIN",
                true
        );
    }

    @Transactional
    public AuthenticatedUser register(String fullName, String phone, String password, String confirmPassword) {
        if (!Objects.equals(password, confirmPassword)) {
            throw new IllegalArgumentException("Пароли не совпадают");
        }
        return registerInternal(fullName, phone, password, "ROLE_USER", false);
    }

    @Transactional(readOnly = true)
    public AuthenticatedUser authenticate(String phone, String password) {
        String normalizedPhone = normalizePhone(phone);
        validatePhone(normalizedPhone);
        validatePassword(password);

        UserAccountEntity user = userAccountRepository.findByPhone(normalizedPhone)
                .orElse(null);
        if (user == null || !user.getPasswordHash().equals(password)) {
            throw new BadCredentialsException("Неверный телефон или пароль");
        }
        return toAuthenticated(user);
    }

    @Transactional(readOnly = true)
    public Optional<AuthenticatedUser> findByPhone(String phone) {
        String normalizedPhone = normalizePhone(phone);
        if (normalizedPhone == null) {
            return Optional.empty();
        }

        return userAccountRepository.findByPhone(normalizedPhone)
                .map(this::toAuthenticated);
    }

    @Transactional(readOnly = true)
    public Set<AuthenticatedUser> findAll() {
        return userAccountRepository.findAll().stream()
                .map(this::toAuthenticated)
                .collect(Collectors.toUnmodifiableSet());
    }

    @Transactional
    public AuthenticatedUser approveUser(String phone) {
        String normalized = normalizePhone(phone);
        validatePhone(normalized);
        UserAccountEntity user = userAccountRepository.findByPhone(normalized)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
        user.setApproved(true);
        UserAccountEntity saved = userAccountRepository.saveAndFlush(user);
        return toAuthenticated(saved);
    }

    private AuthenticatedUser registerInternal(
            String fullName,
            String phone,
            String password,
            String role,
            boolean skipIfExists
    ) {
        validateFullName(fullName);
        String normalizedPhone = normalizePhone(phone);
        validatePhone(normalizedPhone);
        validatePassword(password);

        Optional<UserAccountEntity> existing = userAccountRepository.findByPhone(normalizedPhone);
        if (existing.isPresent()) {
            if (skipIfExists) {
                return toAuthenticated(existing.get());
            }
            throw new IllegalStateException("Пользователь уже существует");
        }

        UserAccountEntity entity = new UserAccountEntity();
        entity.setPhone(normalizedPhone);
        entity.setPhoneNormalized(normalizedPhone);
        entity.setFullName(normalizeFullName(fullName));
        entity.setPasswordHash(password);
        entity.setRole(normalizeRole(role));
        // новые пользователи неапрувнуты; админ по умолчанию апрувнут
        entity.setApproved("ROLE_ADMIN".equals(entity.getRole()));

        try {
            UserAccountEntity saved = userAccountRepository.saveAndFlush(entity);
            return toAuthenticated(saved);
        } catch (DataIntegrityViolationException ex) {
            if (skipIfExists) {
                return userAccountRepository.findByPhone(normalizedPhone)
                        .map(this::toAuthenticated)
                        .orElseThrow(() -> ex);
            }
            throw new IllegalStateException("Пользователь уже существует");
        }
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

    private String normalizePhone(String phone) {
        if (phone == null) {
            return null;
        }
        String digits = phone.replaceAll("\\D", "");
        if (digits.isEmpty()) {
            return null;
        }
        if (digits.length() == 10) {
            return "7" + digits;
        }
        if (digits.length() == 11 && digits.startsWith("8")) {
            return "7" + digits.substring(1);
        }
        if (digits.length() == 11 && digits.startsWith("7")) {
            return digits;
        }
        return digits;
    }

    private void validatePhone(String normalizedPhone) {
        if (normalizedPhone == null || !normalizedPhone.matches("^7\\d{10}$")) {
            throw new IllegalArgumentException("Телефон должен быть в формате Казахстана");
        }
    }

    private void validatePassword(String password) {
        int length = password == null ? 0 : password.length();
        if (length < 6 || length > 100) {
            throw new IllegalArgumentException("Пароль должен быть от 6 до 100 символов");
        }
    }

    private String normalizeRole(String role) {
        if (role == null) {
            return "ROLE_USER";
        }
        String value = role.trim();
        return value.isEmpty() ? "ROLE_USER" : value;
    }

    private AuthenticatedUser toAuthenticated(UserAccountEntity user) {
        return new AuthenticatedUser(
                user.getPhone(),
                user.getFullName(),
                user.getRole(),
                Boolean.TRUE.equals(user.getApproved())
        );
    }
}
