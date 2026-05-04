package com.localkart.util;

/**
 * Application Constants
 */
public class Constants {

    // User Roles
    public static final String ROLE_CUSTOMER = "CUSTOMER";
    public static final String ROLE_VENDOR = "VENDOR";
    public static final String ROLE_DELIVERY_PARTNER = "DELIVERY";
    public static final String ROLE_ADMIN = "ADMIN";

    // Order Status
    public static final String ORDER_STATUS_PENDING = "PENDING";
    public static final String ORDER_STATUS_CONFIRMED = "CONFIRMED";
    public static final String ORDER_STATUS_SHIPPED = "SHIPPED";
    public static final String ORDER_STATUS_DELIVERED = "DELIVERED";
    public static final String ORDER_STATUS_CANCELLED = "CANCELLED";
    public static final String ORDER_STATUS_RETURNED = "RETURNED";

    // Delivery Partner Status
    public static final String DELIVERY_STATUS_AVAILABLE = "AVAILABLE";
    public static final String DELIVERY_STATUS_BUSY = "BUSY";
    public static final String DELIVERY_STATUS_ON_BREAK = "ON_BREAK";
    public static final String DELIVERY_STATUS_UNAVAILABLE = "UNAVAILABLE";

    // Vendor Approval Status
    public static final String VENDOR_STATUS_PENDING = "PENDING";
    public static final String VENDOR_STATUS_APPROVED = "APPROVED";
    public static final String VENDOR_STATUS_REJECTED = "REJECTED";

    // Payment Status
    public static final String PAYMENT_STATUS_PENDING = "PENDING";
    public static final String PAYMENT_STATUS_COMPLETED = "COMPLETED";
    public static final String PAYMENT_STATUS_FAILED = "FAILED";
    public static final String PAYMENT_STATUS_REFUNDED = "REFUNDED";

    // Payment Method
    public static final String PAYMENT_METHOD_CARD = "CARD";
    public static final String PAYMENT_METHOD_UPI = "UPI";
    public static final String PAYMENT_METHOD_NETBANKING = "NETBANKING";
    public static final String PAYMENT_METHOD_WALLET = "WALLET";
    public static final String PAYMENT_METHOD_COD = "COD";

    // API Response Messages
    public static final String MSG_SUCCESS = "Operation successful";
    public static final String MSG_ERROR = "An error occurred";
    public static final String MSG_NOT_FOUND = "Resource not found";
    public static final String MSG_UNAUTHORIZED = "Unauthorized access";
    public static final String MSG_FORBIDDEN = "Access forbidden";

    // Default Values
    public static final int PAGE_SIZE_DEFAULT = 20;
    public static final int PAGE_NUMBER_DEFAULT = 0;
    public static final double DEFAULT_COMMISSION_PERCENTAGE = 10.0;
    public static final double DEFAULT_TAX_PERCENTAGE = 18.0;

    // Limits
    public static final int MAX_PAGE_SIZE = 100;
    public static final int MIN_PAGE_SIZE = 1;
    public static final int MAX_SEARCH_QUERY_LENGTH = 100;
    public static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    public static final long MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10 MB

    // Time in ms
    public static final long JWT_EXPIRATION_MS = 86400000; // 24 hours
    public static final long SESSION_TIMEOUT_MS = 1800000; // 30 minutes

    // Email Patterns
    public static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";

    // Phone Pattern
    public static final String PHONE_PATTERN = "^\\d{10}$";
}
