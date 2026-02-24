package org.example.toi.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Имя обязательно")
        @Size(min = 2, max = 80, message = "Имя должно быть от 2 до 80 символов")
        String fullName,

        @NotBlank(message = "Логин обязателен")
        @Size(min = 3, max = 50, message = "Логин должен быть от 3 до 50 символов")
        String username,

        @NotBlank(message = "Пароль обязателен")
        @Size(min = 6, max = 100, message = "Пароль должен быть от 6 до 100 символов")
        String password,

        @NotBlank(message = "Подтверждение пароля обязательно")
        @Size(min = 6, max = 100, message = "Подтверждение пароля должно быть от 6 до 100 символов")
        String confirmPassword
) {
}
