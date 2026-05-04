package com.localkart.dto;

import com.localkart.entity.User;

public class AuthResponse {
    private String status;
    private String message;
    private String token;
    private User user;

    // Default Constructor (Required by Spring)
    public AuthResponse() {
    }

    // All-Arguments Constructor (Used by your UserService)
    public AuthResponse(String status, String message, String token, User user) {
        this.status = status;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    // --- Getters and Setters ---

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}