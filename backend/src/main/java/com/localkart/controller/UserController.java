package com.localkart.controller;

import com.localkart.entity.User;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.UserService;
import com.localkart.util.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return userService.findById(userDetails.getUserId())
                .map(user -> ResponseEntity.ok(new ApiResponse("success", "Profile retrieved", user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("error", "User not found", null)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @RequestBody User updates) {
        try {
            User updated = userService.updateProfile(userDetails.getUserId(), updates);
            return ResponseEntity.ok(new ApiResponse("success", "Profile updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", e.getMessage(), null));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        // Reuse the profile logic for the /me endpoint
        return getProfile(userDetails);
    }
}