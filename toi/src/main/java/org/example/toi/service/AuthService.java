package org.example.toi.service;

import lombok.RequiredArgsConstructor;
import org.example.toi.dto.request.LoginRequest;
import org.example.toi.dto.request.RegisterRequest;
import org.example.toi.dto.response.AuthResponse;
import org.example.toi.entity.Role;
import org.example.toi.entity.User;
import org.example.toi.repository.UserRepository;
import org.example.toi.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RestTemplate restTemplate;

    @Value("${threads.client-id}")
    private String threadsClientId;

    @Value("${threads.client-secret}")
    private String threadsClientSecret;

    @Value("${threads.redirect-uri}")
    private String threadsRedirectUri;

    private AuthResponse buildResponse(User user) {
        String principalName = user.getPhone() != null ? user.getPhone() : "TH_" + user.getThreadsId();
        var springUser = new org.springframework.security.core.userdetails.User(
                principalName,
                user.getPasswordHash() != null ? user.getPasswordHash() : "",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
        return new AuthResponse(
                jwtService.generateToken(springUser),
                jwtService.generateRefreshToken(springUser),
                new AuthResponse.UserSummary(user.getId(), user.getPhone(), user.getFullName(), user.getRole().name(), user.isApproved())
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.phone())) {
            throw new IllegalStateException("Бұл телефон нөмірі тіркелген");
        }
        User user = User.builder()
                .phone(request.phone())
                .fullName(request.fullName())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .approved(false)
                .build();
        return buildResponse(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByPhone(request.phone())
                .orElseThrow(() -> new BadCredentialsException("Телефон немесе құпиясөз дұрыс емес"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Телефон немесе құпиясөз дұрыс емес");
        }

        return buildResponse(user);
    }

    @Transactional
    @SuppressWarnings("unchecked")
    public AuthResponse loginWithThreads(String code) {
        // 1. Exchange code for short-lived access token
        String tokenUrl = "https://graph.threads.net/oauth/access_token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", threadsClientId);
        params.add("client_secret", threadsClientSecret);
        params.add("grant_type", "authorization_code");
        params.add("redirect_uri", threadsRedirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);

        Map<String, Object> tokenResponse;
        try {
            tokenResponse = restTemplate.postForObject(tokenUrl, tokenRequest, Map.class);
        } catch (Exception e) {
            throw new IllegalStateException("Threads токенін алу сәтсіз болды: " + e.getMessage());
        }

        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            throw new IllegalStateException("Threads жарамды токен қайтармады");
        }

        String accessToken = (String) tokenResponse.get("access_token");

        // 2. Fetch user profile
        String profileUrl = "https://graph.threads.net/me?fields=id,name&access_token=" + accessToken;

        Map<String, Object> profile;
        try {
            profile = restTemplate.getForObject(profileUrl, Map.class);
        } catch (Exception e) {
            throw new IllegalStateException("Threads профилін алу сәтсіз болды: " + e.getMessage());
        }

        if (profile == null || !profile.containsKey("id")) {
            throw new IllegalStateException("Threads профиль деректері жоқ");
        }

        String threadsId = String.valueOf(profile.get("id"));
        String name = profile.getOrDefault("name", "Threads User").toString();

        // 3. Find or create user
        return userRepository.findByThreadsId(threadsId)
                .map(this::buildResponse)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .threadsId(threadsId)
                            .fullName(name)
                            .role(Role.USER)
                            .approved(true) // Threads users are auto-approved
                            .build();
                    return buildResponse(userRepository.save(newUser));
                });
    }
}

