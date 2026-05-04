package com.localkart.controller;

import com.localkart.entity.Order;
import com.localkart.entity.User;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.OrderService;
import com.localkart.service.UserService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class DeliveryController {

    private final OrderService orderService;
    private final UserService userService;

    public DeliveryController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User partner = userService.findById(userDetails.getUserId()).orElse(null);
        if (partner == null) return ResponseEntity.status(404).body(new ApiResponse("error", "Partner not found", null));

        List<Order> myOrders = orderService.getOrdersByDeliveryPartner(userDetails.getUserId());
        List<Order> availableOrders = orderService.getAvailableOrders();

        long deliveries = myOrders.stream().filter(o -> "Delivered".equals(o.getStatus())).count();
        long trips = myOrders.size();
        double earnings = myOrders.stream()
                .filter(o -> "Delivered".equals(o.getStatus()))
                .mapToDouble(o -> o.getDeliveryCharge() != null ? o.getDeliveryCharge() + 20.0 : 60.0)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("earnings", Math.round(earnings * 100.0) / 100.0);
        stats.put("deliveries", deliveries);
        stats.put("trips", trips);
        stats.put("rating", 4.8); // Static for now; can be dynamic from ratings table later

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("partner", partner);
        dashboard.put("stats", stats);
        dashboard.put("orders", myOrders);
        dashboard.put("availableOrders", availableOrders);

        return ResponseEntity.ok(new ApiResponse("success", "Delivery dashboard retrieved", dashboard));
    }

    @GetMapping("/available-orders")
    public ResponseEntity<?> getAvailableOrders() {
        List<Order> orders = orderService.getAvailableOrders();
        return ResponseEntity.ok(new ApiResponse("success", "Available orders retrieved", orders));
    }

    @PostMapping("/orders/{orderId}/accept")
    public ResponseEntity<?> acceptOrder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                         @PathVariable Integer orderId) {
        Order updated = orderService.acceptOrderByDelivery(orderId, userDetails.getUserId());
        if (updated == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Order not available or already assigned", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Order accepted", updated));
    }

    @PostMapping("/orders/{orderId}/complete")
    public ResponseEntity<?> completeOrder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @PathVariable Integer orderId) {
        Order updated = orderService.completeOrderByDelivery(orderId, userDetails.getUserId());
        if (updated == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Cannot complete this order", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Order marked as delivered", updated));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer orderId, @RequestParam String status) {
        Order updated = orderService.updateOrderStatus(orderId, status);
        if (updated == null) return ResponseEntity.status(404).body(new ApiResponse("error", "Order not found", null));
        return ResponseEntity.ok(new ApiResponse("success", "Order status updated", updated));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Order> orders = orderService.getOrdersByDeliveryPartner(userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Orders retrieved", orders));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return userService.findById(userDetails.getUserId())
                .map(u -> ResponseEntity.ok(new ApiResponse("success", "Profile retrieved", u)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse("error", "Not found", null)));
    }
}
