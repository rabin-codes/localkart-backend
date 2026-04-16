package com.localkart.controller;

import com.localkart.dto.CartDTO;
import com.localkart.service.CartService;
import com.localkart.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;

    /**
     * Get cart for user
     * GET /api/cart/{userId}
     * @param userId User ID
     * @return Cart details
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Integer userId) {
        try {
            logger.info("Fetching cart for userId: {}", userId);
            
            CartDTO cartDTO = cartService.getCartByUserId(userId);
            
            if (cartDTO == null) {
                logger.info("No cart found for userId: {}, creating empty cart response", userId);
                Map<String, Object> emptyCart = new HashMap<>();
                emptyCart.put("userId", userId);
                emptyCart.put("isEmpty", true);
                emptyCart.put("totalItems", 0);
                emptyCart.put("totalPrice", 0.0);
                return ResponseEntity.ok(new ApiResponse("success", "Cart retrieved", emptyCart));
            }

            logger.info("Cart fetched successfully for userId: {}", userId);
            return ResponseEntity.ok(new ApiResponse("success", "Cart retrieved", cartDTO));

        } catch (Exception e) {
            logger.error("Error fetching cart: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to fetch cart: " + e.getMessage(), null));
        }
    }

    /**
     * Add item to cart
     * POST /api/cart/{userId}/add/{productId}
     * @param userId User ID
     * @param productId Product ID
     * @param quantity Quantity to add
     * @return Updated cart
     */
    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<?> addToCart(
            @PathVariable Integer userId,
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        try {
            logger.info("Adding productId: {} to cart for userId: {} with quantity: {}", productId, userId, quantity);
            
            CartDTO cartDTO = cartService.addToCart(userId, productId, quantity);
            
            if (cartDTO == null) {
                logger.warn("Failed to add item to cart for userId: {}", userId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse("error", "Failed to add item to cart", null));
            }

            logger.info("Item added to cart successfully for userId: {}", userId);
            return ResponseEntity.ok(new ApiResponse("success", "Item added to cart", cartDTO));

        } catch (Exception e) {
            logger.error("Error adding item to cart: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to add item to cart: " + e.getMessage(), null));
        }
    }

    /**
     * Update cart item quantity
     * PUT /api/cart/{userId}/update/{cartItemId}
     * @param userId User ID
     * @param cartItemId Cart item ID
     * @param quantity New quantity
     * @return Updated cart
     */
    @PutMapping("/{userId}/update/{cartItemId}")
    public ResponseEntity<?> updateCartItem(
            @PathVariable Integer userId,
            @PathVariable Integer cartItemId,
            @RequestParam Integer quantity) {
        try {
            logger.info("Updating cart item cartItemId: {} for userId: {} with quantity: {}", cartItemId, userId, quantity);
            
            if (quantity <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse("error", "Quantity must be greater than 0", null));
            }

            CartDTO cartDTO = cartService.updateCartItem(userId, cartItemId, quantity);
            
            if (cartDTO == null) {
                logger.warn("Failed to update cart item for userId: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("error", "Cart or item not found", null));
            }

            logger.info("Cart item updated successfully for userId: {}", userId);
            return ResponseEntity.ok(new ApiResponse("success", "Cart item updated", cartDTO));

        } catch (Exception e) {
            logger.error("Error updating cart item: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to update cart item: " + e.getMessage(), null));
        }
    }

    /**
     * Remove item from cart
     * DELETE /api/cart/{userId}/remove/{cartItemId}
     * @param userId User ID
     * @param cartItemId Cart item ID
     * @return Updated cart
     */
    @DeleteMapping("/{userId}/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Integer userId,
            @PathVariable Integer cartItemId) {
        try {
            logger.info("Removing cart item cartItemId: {} from userId: {} cart", cartItemId, userId);
            
            CartDTO cartDTO = cartService.removeFromCart(userId, cartItemId);
            
            if (cartDTO == null) {
                logger.warn("Failed to remove item from cart for userId: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("error", "Cart or item not found", null));
            }

            logger.info("Item removed from cart successfully for userId: {}", userId);
            return ResponseEntity.ok(new ApiResponse("success", "Item removed from cart", cartDTO));

        } catch (Exception e) {
            logger.error("Error removing item from cart: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to remove item from cart: " + e.getMessage(), null));
        }
    }

    /**
     * Clear entire cart
     * DELETE /api/cart/{userId}/clear
     * @param userId User ID
     * @return Success message
     */
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Integer userId) {
        try {
            logger.info("Clearing cart for userId: {}", userId);
            
            boolean success = cartService.clearCart(userId);
            
            if (!success) {
                logger.warn("Failed to clear cart for userId: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("error", "Cart not found", null));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("message", "Cart cleared successfully");

            logger.info("Cart cleared successfully for userId: {}", userId);
            return ResponseEntity.ok(new ApiResponse("success", "Cart cleared", response));

        } catch (Exception e) {
            logger.error("Error clearing cart: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to clear cart: " + e.getMessage(), null));
        }
    }

    /**
     * Get cart summary
     * GET /api/cart/{userId}/summary
     * @param userId User ID
     * @return Cart summary with totals
     */
    @GetMapping("/{userId}/summary")
    public ResponseEntity<?> getCartSummary(@PathVariable Integer userId) {
        try {
            logger.info("Fetching cart summary for userId: {}", userId);
            
            CartDTO cartDTO = cartService.getCartByUserId(userId);
            
            if (cartDTO == null) {
                Map<String, Object> emptySummary = new HashMap<>();
                emptySummary.put("userId", userId);
                emptySummary.put("totalItems", 0);
                emptySummary.put("totalPrice", 0.0);
                emptySummary.put("totalDiscount", 0.0);
                emptySummary.put("totalSavings", 0.0);
                emptySummary.put("isEmpty", true);
                return ResponseEntity.ok(new ApiResponse("success", "Cart summary retrieved", emptySummary));
            }

            Map<String, Object> summary = new HashMap<>();
            summary.put("userId", userId);
            summary.put("totalItems", cartDTO.getTotalItems());
            summary.put("totalPrice", cartDTO.getCartTotal());
            summary.put("totalDiscount", cartDTO.getTotalDiscount());
            summary.put("totalSavings", cartDTO.getTotalSavings());
            summary.put("isEmpty", false);
            summary.put("lastUpdated", cartDTO.getLastUpdated());

            logger.info("Cart summary fetched for userId: {}", userId);
            return ResponseEntity.ok(new ApiResponse("success", "Cart summary retrieved", summary));

        } catch (Exception e) {
            logger.error("Error fetching cart summary: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to fetch cart summary: " + e.getMessage(), null));
        }
    }

    /**
     * Get cart items count
     * GET /api/cart/{userId}/count
     * @param userId User ID
     * @return Quantity of items in cart
     */
    @GetMapping("/{userId}/count")
    public ResponseEntity<?> getCartItemsCount(@PathVariable Integer userId) {
        try {
            logger.info("Fetching cart items count for userId: {}", userId);
            
            CartDTO cartDTO = cartService.getCartByUserId(userId);
            
            int itemCount = 0;
            if (cartDTO != null) {
                itemCount = cartDTO.getTotalItems();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("itemCount", itemCount);

            logger.info("Cart items count retrieved for userId: {}, count: {}", userId, itemCount);
            return ResponseEntity.ok(new ApiResponse("success", "Cart items count retrieved", response));

        } catch (Exception e) {
            logger.error("Error fetching cart items count: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to fetch cart items count: " + e.getMessage(), null));
        }
    }

    /**
     * Apply coupon code
     * POST /api/cart/{userId}/apply-coupon
     * @param userId User ID
     * @param couponCode Coupon code
     * @return Updated cart with discount applied
     */
    @PostMapping("/{userId}/apply-coupon")
    public ResponseEntity<?> applyCoupon(
            @PathVariable Integer userId,
            @RequestParam String couponCode) {
        try {
            logger.info("Applying coupon {} to cart for userId: {}", couponCode, userId);
            
            CartDTO cartDTO = cartService.applyCoupon(userId, couponCode);
            
            if (cartDTO == null) {
                logger.warn("Failed to apply coupon {} for userId: {}", couponCode, userId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse("error", "Failed to apply coupon", null));
            }

            logger.info("Coupon applied successfully to cart for userId: {}", userId);
            return ResponseEntity.ok(new ApiResponse("success", "Coupon applied", cartDTO));

        } catch (Exception e) {
            logger.error("Error applying coupon: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to apply coupon: " + e.getMessage(), null));
        }
    }

    /**
     * Remove coupon
     * POST /api/cart/{userId}/remove-coupon
     * @param userId User ID
     * @return Updated cart without discount
     */
    @PostMapping("/{userId}/remove-coupon")
    public ResponseEntity<?> removeCoupon(@PathVariable Integer userId) {
        try {
            logger.info("Removing coupon from cart for userId: {}", userId);
            
            CartDTO cartDTO = cartService.removeCoupon(userId);
            
            if (cartDTO == null) {
                logger.warn("Failed to remove coupon for userId: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("error", "Cart not found", null));
            }

            logger.info("Coupon removed successfully from cart for userId: {}", userId);
            return ResponseEntity.ok(new ApiResponse("success", "Coupon removed", cartDTO));

        } catch (Exception e) {
            logger.error("Error removing coupon: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to remove coupon: " + e.getMessage(), null));
        }
    }

    /**
     * Check if cart is empty
     * GET /api/cart/{userId}/is-empty
     * @param userId User ID
     * @return Empty status
     */
    @GetMapping("/{userId}/is-empty")
    public ResponseEntity<?> isCartEmpty(@PathVariable Integer userId) {
        try {
            logger.info("Checking if cart is empty for userId: {}", userId);
            
            boolean isEmpty = cartService.isCartEmpty(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("isEmpty", isEmpty);

            logger.info("Cart empty status checked for userId: {}, isEmpty: {}", userId, isEmpty);
            return ResponseEntity.ok(new ApiResponse("success", "Cart empty status retrieved", response));

        } catch (Exception e) {
            logger.error("Error checking cart empty status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to check cart status: " + e.getMessage(), null));
        }
    }
}
