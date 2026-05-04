package com.localkart.controller;

import com.localkart.dto.CartDTO;
import com.localkart.entity.User;
import com.localkart.security.CustomUserDetails;
import com.localkart.repository.UserRepository;
import com.localkart.service.CartService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        CartDTO cart = cartService.getCartDTO(user);
        return ResponseEntity.ok(new ApiResponse("success", "Cart retrieved", cart));
    }

    @PostMapping("/items")
    public ResponseEntity<?> addItem(@AuthenticationPrincipal CustomUserDetails userDetails,
                                     @RequestBody Map<String, Object> payload) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Integer productId = (Integer) payload.get("productId");
        Integer quantity = payload.get("quantity") != null ? (Integer) payload.get("quantity") : 1;
        CartDTO cart = cartService.addItem(user, productId, quantity);
        return ResponseEntity.ok(new ApiResponse("success", "Item added to cart", cart));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<?> updateItem(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @PathVariable Integer productId,
                                        @RequestBody Map<String, Object> payload) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Integer quantity = (Integer) payload.get("quantity");
        CartDTO cart = cartService.updateItem(user, productId, quantity);
        return ResponseEntity.ok(new ApiResponse("success", "Cart updated", cart));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<?> removeItem(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @PathVariable Integer productId) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        CartDTO cart = cartService.removeItem(user, productId);
        return ResponseEntity.ok(new ApiResponse("success", "Item removed", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartService.clearCart(user);
        CartDTO empty = new CartDTO(null, java.util.List.of(), 0.0, 0);
        return ResponseEntity.ok(new ApiResponse("success", "Cart cleared", empty));
    }
}
