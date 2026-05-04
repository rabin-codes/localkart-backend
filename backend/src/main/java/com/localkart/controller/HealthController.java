package com.localkart.controller;

import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<?> checkHealth() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("message", "LocalKart Backend is running gracefully");
        data.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(new ApiResponse("success", "Backend is healthy", data));
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Pong");
    }
}
