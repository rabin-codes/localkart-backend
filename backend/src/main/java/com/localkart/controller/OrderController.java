package com.localkart.controller;

import com.localkart.entity.Order;
import com.localkart.entity.OrderItem;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.OrderService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Order orderRequest) {
        
        Order order = orderService.createOrder(userDetails.getUserId(), orderRequest.getItems(), orderRequest);
        if (order == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", "Failed to create order", null));
        }
        return ResponseEntity.status(201).body(new ApiResponse("success", "Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Order> orders = orderService.getOrdersByUser(userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Orders retrieved", orders));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.status(404).body(new ApiResponse("error", "Order not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Order retrieved", order));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer orderId, @RequestParam String status) {
        Order updated = orderService.updateOrderStatus(orderId, status);
        if (updated == null) {
            return ResponseEntity.status(404).body(new ApiResponse("error", "Order not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Order status updated", updated));
    }
}
