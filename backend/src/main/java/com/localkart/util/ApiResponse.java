package com.localkart.util;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Generic API Response wrapper for all endpoints
 * Provides consistent response format across the application
 */
public class ApiResponse {

    @JsonProperty("status")
    private String status;

    @JsonProperty("message")
    private String message;

    @JsonProperty("data")
    private Object data;

    /**
     * Constructor without data
     */
    public ApiResponse(String status, String message) {
        this.status = status;
        this.message = message;
        this.data = null;
    }

    /**
     * Constructor with data
     */
    public ApiResponse(String status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // Getters and Setters

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

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "ApiResponse{" +
                "status='" + status + '\'' +
                ", message='" + message + '\'' +
                ", data=" + data +
                '}';
    }
}
