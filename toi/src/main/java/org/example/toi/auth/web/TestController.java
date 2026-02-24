package org.example.toi.auth.web;

import java.time.Instant;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TestController {

    @GetMapping("/test")
    public Map<String, Object> test(Authentication authentication) {
        return Map.of(
                "message", "JWT валиден, доступ к защищенному endpoint открыт",
                "user", authentication.getName(),
                "timestamp", Instant.now().toString()
        );
    }
}
