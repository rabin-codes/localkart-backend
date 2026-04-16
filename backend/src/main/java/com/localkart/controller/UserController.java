package com.localkart.controller;

import com.localkart.entity.User;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.UserService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return userService.findById(userDetails.getUserId())
                .map(user -> ResponseEntity.ok(new ApiResponse("success", "Profile retrieved", user)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse("error", "User not found", null)));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return getProfile(userDetails);
    }
}
