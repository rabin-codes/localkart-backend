package com.localkart.controller;

import com.localkart.dto.AuthRequest;
import com.localkart.dto.AuthResponse;
import com.localkart.entity.User;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.UserService;
import com.localkart.util.ApiResponse; // Make sure this matches where your ApiResponse is located
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody AuthRequest request) {
        logger.info("Login attempt for: {}", request.getEmail());
        AuthResponse response = userService.login(request);
        
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("error", response.getMessage(), null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Login successful", response));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(@RequestBody User user) {
        logger.info("Signup: {}", user.getEmail());
        
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Email and password required", null));
        }
        if (user.getName() == null || user.getName().isEmpty()) {
            user.setName(user.getEmail().split("@")[0]);
        }
        
        user.setRole("USER");
        AuthResponse response = userService.signup(user);
        
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", response.getMessage(), null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Signup successful", response));
    }

    @PostMapping("/signup/vendor")
    public ResponseEntity<ApiResponse> vendorSignup(@RequestBody User user) {
        logger.info("Vendor signup: {}", user.getEmail());
        
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Email and password required", null));
        }
        if (user.getName() == null || user.getName().isEmpty()) {
            user.setName(user.getShopName() != null ? user.getShopName() : user.getEmail().split("@")[0]);
        }
        
        user.setRole("VENDOR");
        AuthResponse response = userService.signup(user);
        
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", response.getMessage(), null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Vendor signup successful", response));
    }

    @PostMapping("/signup/delivery")
    public ResponseEntity<ApiResponse> deliverySignup(@RequestBody User user) {
        logger.info("Delivery signup: {}", user.getEmail());
        
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Email and password required", null));
        }
        if (user.getName() == null || user.getName().isEmpty()) {
            user.setName(user.getEmail().split("@")[0]);
        }
        
        user.setRole("DELIVERY");
        AuthResponse response = userService.signup(user);
        
        if ("error".equals(response.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", response.getMessage(), null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Delivery signup successful", response));
    }

    /** GET /api/auth/me - Returns current user from JWT token (required for session restoration) */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("error", "Not authenticated", null));
        }
        
        Optional<User> userOpt = userService.findById(userDetails.getUserId());
        
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(new ApiResponse("success", "User retrieved", userOpt.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("error", "User not found", null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        return ResponseEntity.ok(new ApiResponse("success", "Logged out successfully", null));
    }
    
}