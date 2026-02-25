package org.example.toi.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Имя обязательно")
        @Size(min = 2, max = 80, message = "Имя должно быть от 2 до 80 символов")
        String fullName,

        @NotBlank(message = "Телефон обязателен")
        @Size(min = 10, max = 20, message = "Телефон должен быть корректным")
        String phone,

        @NotBlank(message = "Пароль обязателен")
        @Size(min = 6, max = 100, message = "Пароль должен быть от 6 до 100 символов")
        String password,

        @NotBlank(message = "Подтверждение пароля обязательно")
        @Size(min = 6, max = 100, message = "Подтверждение пароля должно быть от 6 до 100 символов")
        String confirmPassword
) {
}
