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

import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
@RequiredArgsConstructor
public class AuthService {

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
}
