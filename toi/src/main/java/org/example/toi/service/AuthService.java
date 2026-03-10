package org.example.toi.service;

import lombok.RequiredArgsConstructor;
import org.example.toi.dto.request.LoginRequest;
import org.example.toi.dto.request.RegisterRequest;
import org.example.toi.dto.response.AuthResponse;
import org.example.toi.entity.Role;
import org.example.toi.entity.User;
import org.example.toi.repository.UserRepository;
import org.example.toi.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.UUID;

import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Value("${threads.client-id}")
    private String threadsClientId;

    @Value("${threads.client-secret}")
    private String threadsClientSecret;

    @Value("${threads.redirect-uri}")
    private String threadsRedirectUri;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private AuthResponse buildResponse(User user) {
        var springUser = new org.springframework.security.core.userdetails.User(
                user.getPhone(),
                user.getPasswordHash(),
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
                .approved(false) // Requires admin approval
                .build();
        return buildResponse(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByPhone(request.phone())
                .orElseThrow(() -> new BadCredentialsException("Телефон немесе құпиясөз дұрыс емес"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Телефон немесе құпиясөз дұрыс емес");
        }

        // We allow login even if not approved — frontend will show pending modal
        return buildResponse(user);
    }

    @Transactional
    public AuthResponse loginWithFacebook(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://graph.facebook.com/me?fields=id,name&access_token=" + accessToken;
        
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> body = response.getBody();
            if (body == null || !body.containsKey("id")) {
                throw new BadCredentialsException("Invalid Facebook token");
            }
            
            String facebookId = (String) body.get("id");
            String fullName = (String) body.getOrDefault("name", "Facebook User");
            
            User user = userRepository.findByFacebookId(facebookId).orElseGet(() -> {
                User newUser = User.builder()
                        .facebookId(facebookId)
                        .phone("FB_" + facebookId)
                        .fullName(fullName)
                        .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .role(Role.USER)
                        // Auto-approve FB users or require admin approval? Following existing logic.
                        .approved(false) 
                        .build();
                return userRepository.save(newUser);
            });
            
            return buildResponse(user);
        } catch (Exception e) {
            throw new BadCredentialsException("Failed to verify Facebook token: " + e.getMessage());
        }
    }

    @Transactional
    public AuthResponse loginWithThreads(String code) {
        RestTemplate restTemplate = new RestTemplate();
        
        // 1. Exchange code for access token
        String tokenUrl = "https://graph.threads.net/oauth/access_token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", threadsClientId);
        body.add("client_secret", threadsClientSecret);
        body.add("grant_type", "authorization_code");
        body.add("redirect_uri", threadsRedirectUri);
        body.add("code", code);
        
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, request, Map.class);
            Map<String, Object> tokenBody = tokenResponse.getBody();
            if (tokenBody == null || !tokenBody.containsKey("access_token")) {
                throw new BadCredentialsException("Failed to retrieve Threads access token");
            }
            
            String accessToken = (String) tokenBody.get("access_token");
            
            // 2. Get user info
            String meUrl = "https://graph.threads.net/v1.0/me?fields=id,username,name&access_token=" + accessToken;
            ResponseEntity<Map> meResponse = restTemplate.getForEntity(meUrl, Map.class);
            Map<String, Object> meBody = meResponse.getBody();
            
            if (meBody == null || !meBody.containsKey("id")) {
                throw new BadCredentialsException("Failed to retrieve Threads user info");
            }
            
            String threadsId = (String) meBody.get("id");
            String username = (String) meBody.getOrDefault("username", "threads_user");
            String fullName = (String) meBody.getOrDefault("name", username);
            
            // 3. Find or create user
            User user = userRepository.findByThreadsId(threadsId).orElseGet(() -> {
                User newUser = User.builder()
                        .threadsId(threadsId)
                        .phone("TH_" + threadsId) // Dummy phone for Threads users
                        .fullName(fullName)
                        .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .role(Role.USER)
                        .approved(false) // Consistent with existing logic
                        .build();
                return userRepository.save(newUser);
            });
            
            return buildResponse(user);
        } catch (Exception e) {
            throw new BadCredentialsException("Threads OAuth failed: " + e.getMessage());
        }
    }
}
