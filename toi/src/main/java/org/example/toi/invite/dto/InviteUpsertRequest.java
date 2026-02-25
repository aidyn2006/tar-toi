package org.example.toi.invite.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record InviteUpsertRequest(
        @Size(max = 64, message = "Некорректный id")
        String id,

        @NotBlank(message = "Категория обязательна")
        @Size(max = 32, message = "Категория слишком длинная")
        String categoryKey,

        @NotBlank(message = "Название категории обязательно")
        @Size(max = 80, message = "Название категории слишком длинное")
        String categoryLabel,

        @NotBlank(message = "Заголовок обязателен")
        @Size(max = 140, message = "Заголовок слишком длинный")
        String title,

        @Size(max = 4000, message = "Описание слишком длинное")
        String description,

        LocalDate date,

        @Size(max = 10, message = "Время слишком длинное")
        String time,

        @Size(max = 200, message = "Место слишком длинное")
        String place,

        @Size(max = 60, message = "Поле song слишком длинное")
        String song,

        @Size(max = 300, message = "Ссылка на карту слишком длинная")
        String mapLink,

        @Size(max = 160, message = "Поле хозяева слишком длинное")
        String hosts,

        @Min(value = 1, message = "Максимум гостей должен быть от 1 до 20")
        @Max(value = 20, message = "Максимум гостей должен быть от 1 до 20")
        Integer maxGuests,

        @Size(max = 1048576, message = "Фото слишком большое")
        String previewPhoto
) {
}
