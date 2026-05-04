package com.localkart.controller;

import com.localkart.dto.ProductDTO;
import com.localkart.entity.Order;
import com.localkart.entity.User;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.FileStorageService;
import com.localkart.service.OrderService;
import com.localkart.service.ProductService;
import com.localkart.service.UserService;
import com.localkart.util.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final UserService userService;
    private final ProductService productService;
    private final OrderService orderService;
    private final FileStorageService fileStorageService;

    public VendorController(UserService userService, ProductService productService,
                            OrderService orderService, FileStorageService fileStorageService) {
        this.userService = userService;
        this.productService = productService;
        this.orderService = orderService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User vendor = userService.findById(userDetails.getUserId()).orElse(null);
        if (vendor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("error", "Vendor not found", null));
        }

        List<ProductDTO> products = productService.getProductsByVendor(userDetails.getUserId(), PageRequest.of(0, 100)).getContent();
        List<Order> orders = orderService.getOrdersByVendor(userDetails.getUserId());

        // Calculate stats
        double totalSales = orders.stream()
                .filter(o -> "Delivered".equals(o.getStatus()))
                .mapToDouble(Order::getTotal).sum();
        long activeOrders = orders.stream()
                .filter(o -> !"Delivered".equals(o.getStatus()) && !"Cancelled".equals(o.getStatus()))
                .count();
        long uniqueCustomers = orders.stream()
                .filter(o -> o.getCustomer() != null)
                .map(o -> o.getCustomer().getId())
                .distinct().count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", products.size());
        stats.put("totalSales", Math.round(totalSales * 100.0) / 100.0);
        stats.put("activeOrders", activeOrders);
        stats.put("happyCustomers", uniqueCustomers);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("vendor", vendor);
        dashboard.put("stats", stats);
        dashboard.put("products", products);
        dashboard.put("orders", orders);

        return ResponseEntity.ok(new ApiResponse("success", "Dashboard data retrieved", dashboard));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse> getVendorProducts(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "50") int size) {
        Page<ProductDTO> products = productService.getProductsByVendor(userDetails.getUserId(), PageRequest.of(page, size));
        return ResponseEntity.ok(new ApiResponse("success", "Vendor products retrieved", products.getContent()));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse> addProduct(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                  @RequestBody ProductDTO productDTO) {
        productDTO.setVendorId(userDetails.getUserId());
        ProductDTO created = productService.addProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("success", "Product added", created));
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<ApiResponse> updateProduct(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @PathVariable Integer productId,
                                                     @RequestBody ProductDTO productDTO) {
        try {
            productDTO.setId(productId);
            ProductDTO updated = productService.updateProductForVendor(productId, productDTO, userDetails.getUserId());
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("error", "Product not found", null));
            }
            return ResponseEntity.ok(new ApiResponse("success", "Product updated", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse("error", e.getMessage(), null));
        }
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<ApiResponse> deleteProduct(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @PathVariable Integer productId) {
        try {
            boolean ok = productService.deleteProductForVendor(productId, userDetails.getUserId());
            if (!ok) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("error", "Product not found", null));
            }
            return ResponseEntity.ok(new ApiResponse("success", "Product deleted", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse("error", e.getMessage(), null));
        }
    }

    @PostMapping(value = "/products/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> uploadProductImage(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                          @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = fileStorageService.storeProductImage(file);
            Map<String, String> result = new HashMap<>();
            result.put("imageUrl", imageUrl);
            return ResponseEntity.ok(new ApiResponse("success", "Image uploaded successfully", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", e.getMessage(), null));
        }
    }
    @PostMapping(value = "/products/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Save the file using your FileStorageService
            String fileName = fileStorageService.storeProductImage(file);
            
            // 2. Create the full URL (assuming your backend serves from /uploads/)
            String imageUrl = "http://localhost:8080/uploads/" + fileName;

            Map<String, String> data = new HashMap<>();
            data.put("imageUrl", imageUrl);

            return ResponseEntity.ok(new ApiResponse("success", "Image uploaded successfully", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", "Failed to upload: " + e.getMessage(), null));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse> getVendorOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Order> orders = orderService.getOrdersByVendor(userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Vendor orders retrieved", orders));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponse> updateOrderStatus(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                         @PathVariable Integer orderId,
                                                         @RequestParam String status) {
        Order updated = orderService.updateOrderStatus(orderId, status);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("error", "Order not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Order status updated", updated));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return userService.findById(userDetails.getUserId())
                .map(vendor -> ResponseEntity.ok(new ApiResponse("success", "Profile retrieved", vendor)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("error", "Vendor not found", null)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @RequestBody User updates) {
        try {
            User updated = userService.updateProfile(userDetails.getUserId(), updates);
            return ResponseEntity.ok(new ApiResponse("success", "Profile updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", e.getMessage(), null));
        }
    }
}