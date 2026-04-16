package com.localkart.controller;

import com.localkart.dto.AuthRequest;
import com.localkart.dto.AuthResponse;
import com.localkart.entity.User;
import com.localkart.service.UserService;
import com.localkart.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        logger.info("Login attempt for email: {}", request.getEmail());
        AuthResponse response = userService.login(request);
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.status(401).body(new ApiResponse("error", response.getMessage(), null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Login successful", response));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        logger.info("Signup attempt for email: {}", user.getEmail());
        user.setRole("USER");
        AuthResponse response = userService.signup(user);
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", response.getMessage(), null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Signup successful", response));
    }

    @PostMapping("/signup/vendor")
    public ResponseEntity<?> vendorSignup(@RequestBody User user) {
        logger.info("Vendor signup attempt for email: {}", user.getEmail());
        user.setRole("VENDOR");
        AuthResponse response = userService.signup(user);
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", response.getMessage(), null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Vendor signup successful", response));
    }

    @PostMapping("/signup/delivery")
    public ResponseEntity<?> deliverySignup(@RequestBody User user) {
        logger.info("Delivery partner signup attempt for email: {}", user.getEmail());
        user.setRole("DELIVERY");
        AuthResponse response = userService.signup(user);
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", response.getMessage(), null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Delivery partner signup successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(new ApiResponse("success", "Logged out successfully", null));
    }
}
