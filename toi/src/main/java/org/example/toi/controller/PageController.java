package org.example.toi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/pages")
public class PageController {

    @GetMapping("/privacy")
    public ResponseEntity<Map<String, String>> getPrivacyPolicy() {
        return ResponseEntity.ok(Map.of(
            "title_ru", "Политика конфиденциальности",
            "title_kk", "Құпиялылық саясаты",
            "content_ru", "Официальная политика конфиденциальности сервиса электронных пригласительных Toi. Документ доступен на веб-сайте /privacy.",
            "content_kk", "Toi электронды шақыру сервисінің ресми құпиялылық саясаты. Құжат веб-сайтта /privacy қол жетімді."
        ));
    }
}
