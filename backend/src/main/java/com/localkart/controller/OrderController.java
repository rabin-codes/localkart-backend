package com.localkart.controller;

import com.localkart.dto.OrderRequestDTO;
import com.localkart.entity.Order;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.OrderService;
import com.localkart.service.PredictionService;
import com.localkart.util.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class OrderController {

    private final OrderService orderService;
    private final PredictionService predictionService;

    public OrderController(OrderService orderService, PredictionService predictionService) {
        this.orderService = orderService;
        this.predictionService = predictionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody OrderRequestDTO orderRequest) {
        
        // 1. Create the order
        Order order = orderService.createOrder(userDetails.getUserId(), orderRequest);
        
        if (order == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to create order. Check stock availability.", null));
        }

        // 2. Track behavior for AI predictions (Encapsulated in try-catch to avoid order failure)
        try {
            if (predictionService != null && order.getCustomer() != null) {
                predictionService.trackOrderBehavior(order.getCustomer(), order.getItems());
            }
        } catch (Exception e) {
            // Log the error but don't stop the response
            System.err.println("AI Prediction Error: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("success", "Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Order> orders = orderService.getOrdersByUser(userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Orders retrieved", orders));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse> getOrderById(@PathVariable Integer orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("error", "Order not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Order retrieved", order));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable Integer orderId, @RequestParam String status) {
        Order updated = orderService.updateOrderStatus(orderId, status);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("error", "Order not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Order status updated", updated));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse> getAvailableOrders() {
        List<Order> orders = orderService.getAvailableOrders();
        return ResponseEntity.ok(new ApiResponse("success", "Available orders retrieved", orders));
    }
}