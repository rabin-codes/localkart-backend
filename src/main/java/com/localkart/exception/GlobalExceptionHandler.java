package com.localkart.exception;

import com.localkart.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler
 * Centralized exception handling for all controllers
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle ResourceNotFoundException
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        logger.error("Resource not found: {}", ex.getMessage());
        
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("status", HttpStatus.NOT_FOUND.value());
        errorDetails.put("error", "Not Found");
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(new ApiResponse("error", ex.getMessage(), errorDetails), HttpStatus.NOT_FOUND);
    }

    /**
     * Handle UnauthorizedException
     */
    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<?> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
        logger.error("Unauthorized access: {}", ex.getMessage());

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("status", HttpStatus.UNAUTHORIZED.value());
        errorDetails.put("error", "Unauthorized");
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(new ApiResponse("error", ex.getMessage(), errorDetails), HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle AuthenticationException
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        logger.error("Authentication failed: {}", ex.getMessage());

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("status", HttpStatus.UNAUTHORIZED.value());
        errorDetails.put("error", "Unauthorized");
        errorDetails.put("message", "Authentication failed");
        errorDetails.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(new ApiResponse("error", "Authentication failed", errorDetails), HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle AccessDeniedException
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        logger.error("Access denied: {}", ex.getMessage());

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("status", HttpStatus.FORBIDDEN.value());
        errorDetails.put("error", "Forbidden");
        errorDetails.put("message", "Access Denied");
        errorDetails.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(new ApiResponse("error", "Access Denied", errorDetails), HttpStatus.FORBIDDEN);
    }

    /**
     * Handle Generic Exception
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        logger.error("An error occurred: {}", ex.getMessage(), ex);

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorDetails.put("error", "Internal Server Error");
        errorDetails.put("message", "An unexpected error occurred");
        errorDetails.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(new ApiResponse("error", "Internal Server Error", errorDetails), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
