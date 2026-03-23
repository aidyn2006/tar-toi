package org.example.toi.service.impl;

import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.example.toi.common.exception.ConflictException;
import org.example.toi.common.exception.ForbiddenException;
import org.example.toi.dto.request.LoginRequest;
import org.example.toi.dto.request.RegisterRequest;
import org.example.toi.dto.response.AuthResponse;
import org.example.toi.entity.User;
import org.example.toi.entity.enums.Role;
import org.example.toi.repository.UserRepository;
import org.example.toi.security.JwtService;
import org.example.toi.service.AuthService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

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

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhoneAndIsDeletedFalse(request.getPhone())) {
            throw new ConflictException("Бұл телефон нөмірі тіркелген");
        }
        User user = User.builder()
                .phone(request.getPhone())
                .fullName(request.getFullName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .approved(false) // Requires admin approval
                .build();
        return buildResponse(userRepository.save(user));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByPhoneAndIsDeletedFalse(request.getPhone())
                .orElseThrow(() -> new BadCredentialsException("Телефон немесе құпиясөз дұрыс емес"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Телефон немесе құпиясөз дұрыс емес");
        }


        return buildResponse(user);
    }
}
