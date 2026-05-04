package com.localkart.controller;

import com.localkart.dto.ComboOrderDTO;
import com.localkart.entity.ComboOrder;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.ComboOrderService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/combo")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ComboController {

    private final ComboOrderService comboOrderService;

    public ComboController(ComboOrderService comboOrderService) {
        this.comboOrderService = comboOrderService;
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createComboOrder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @RequestBody ComboOrderDTO dto) {
        try {
            ComboOrder order = comboOrderService.createComboOrder(userDetails.getUserId(), dto);
            return ResponseEntity.status(201).body(new ApiResponse("success", "Combo order placed!", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", e.getMessage(), null));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getMyComboOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ComboOrder> orders = comboOrderService.getUserComboOrders(userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Combo orders retrieved", orders));
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableComboOrders() {
        List<ComboOrder> orders = comboOrderService.getAvailableComboOrders();
        return ResponseEntity.ok(new ApiResponse("success", "Available combo orders", orders));
    }

    @PostMapping("/orders/{orderId}/accept")
    public ResponseEntity<?> acceptComboOrder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @PathVariable Long orderId) {
        try {
            ComboOrder order = comboOrderService.acceptByDelivery(orderId, userDetails.getUserId());
            return ResponseEntity.ok(new ApiResponse("success", "Combo order accepted", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", e.getMessage(), null));
        }
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long orderId, @RequestParam String status) {
        try {
            ComboOrder order = comboOrderService.updateStatus(orderId, status);
            return ResponseEntity.ok(new ApiResponse("success", "Status updated", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", e.getMessage(), null));
        }
    }

    /** Suggest how products from different sellers can be combined */
    @PostMapping("/suggest")
    public ResponseEntity<?> suggestCombo(@RequestBody Map<String, Object> payload) {
        @SuppressWarnings("unchecked")
        List<Integer> productIds = (List<Integer>) payload.get("productIds");
        Map<String, Object> suggestion = comboOrderService.getSuggestedCombos(productIds);
        return ResponseEntity.ok(new ApiResponse("success", "Combo suggestion", suggestion));
    }
}
