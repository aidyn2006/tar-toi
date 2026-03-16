package org.example.toi.service;

import org.example.toi.dto.request.LoginRequest;
import org.example.toi.dto.request.RegisterRequest;
import org.example.toi.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
