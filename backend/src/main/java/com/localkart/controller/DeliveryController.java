package com.localkart.controller;

import com.localkart.entity.Order;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.OrderService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DeliveryController {

    private final OrderService orderService;

    public DeliveryController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Order> orders = orderService.getOrdersByDeliveryPartner(userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Delivery dashboard retrieved", orders));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestParam String status) {
        Order updated = orderService.updateOrderStatus(orderId, status);
        if (updated == null) {
            return ResponseEntity.status(404).body(new ApiResponse("error", "Order not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Order status updated", updated));
    }
}
