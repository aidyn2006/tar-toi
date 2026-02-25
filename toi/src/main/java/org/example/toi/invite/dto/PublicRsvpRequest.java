package org.example.toi.invite.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PublicRsvpRequest(
        @NotBlank(message = "Имя обязательно")
        @Size(min = 2, max = 120, message = "Имя должно быть от 2 до 120 символов")
        String name,

        @NotBlank(message = "Телефон обязателен")
        @Size(min = 7, max = 30, message = "Телефон должен быть от 7 до 30 символов")
        String phone,

        @Min(value = 1, message = "Количество гостей должно быть от 1 до 20")
        @Max(value = 20, message = "Количество гостей должно быть от 1 до 20")
        Integer guests,

        @NotBlank(message = "Статус обязателен")
        @Pattern(regexp = "yes|maybe|no", message = "Статус должен быть yes, maybe или no")
        String status,

        @Size(max = 500, message = "Комментарий слишком длинный")
        String note
) {
}
