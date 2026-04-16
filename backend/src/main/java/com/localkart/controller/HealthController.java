package com.localkart.controller;

import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> details = new HashMap<>();
        details.put("status", "UP");
        details.put("message", "LocalKart Backend is running");
        details.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(new ApiResponse("success", "Backend is healthy", details));
    }
}
