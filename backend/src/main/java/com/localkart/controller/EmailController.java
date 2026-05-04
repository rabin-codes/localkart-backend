package com.localkart.controller;

import com.localkart.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class EmailController {

    private static final Logger logger = LoggerFactory.getLogger(EmailController.class);

    /**
     * Mock endpoint to simulate sending an email notification.
     * In a production environment, this would integrate with an email provider like SendGrid or SMTP.
     */
    @PostMapping("/notify")
    public ResponseEntity<?> sendNotification(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String type = payload.getOrDefault("type", "GENERAL_NOTIFICATION");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", "Email is required", null));
        }

        // --- Mock Startup Logic ---
        logger.info("========================================");
        logger.info("🚀 STARTUP NOTIFICATION SYSTEM");
        logger.info("Type: {}", type);
        logger.info("To: {}", email);
        logger.info("Message: Welcome to LocalKart! Your shop-local journey begins now.");
        logger.info("Status: EMAIL_SENT_SUCCESSFULLY (MOCK)");
        logger.info("========================================");

        return ResponseEntity.ok(new ApiResponse("success", "Email notification triggered for " + email, null));
    }
}
