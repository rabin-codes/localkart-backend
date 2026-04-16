package com.localkart.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Response Builder Utility
 * Builds consistent API response format
 */
public class ResponseBuilder {

    /**
     * Build success response
     */
    public static ApiResponse success(String message, Object data) {
        return new ApiResponse("success", message, data);
    }

    /**
     * Build success response without data
     */
    public static ApiResponse success(String message) {
        return new ApiResponse("success", message, null);
    }

    /**
     * Build error response
     */
    public static ApiResponse error(String message) {
        return new ApiResponse("error", message, null);
    }

    /**
     * Build error response with data
     */
    public static ApiResponse error(String message, Object data) {
        return new ApiResponse("error", message, data);
    }

    /**
     * Build paginated response
     */
    public static Map<String, Object> paginated(Object content, int page, int size, long total, int pages) {
        Map<String, Object> response = new HashMap<>();
        response.put("content", content);
        response.put("page", page);
        response.put("size", size);
        response.put("total", total);
        response.put("pages", pages);
        response.put("hasNext", page < pages - 1);
        response.put("hasPrevious", page > 0);
        return response;
    }

    /**
     * Build paginated response with additional metadata
     */
    public static Map<String, Object> paginatedWithMetadata(Object content, int page, int size, 
                                                            long total, int pages, Object metadata) {
        Map<String, Object> response = paginated(content, page, size, total, pages);
        response.put("metadata", metadata);
        return response;
    }
}
