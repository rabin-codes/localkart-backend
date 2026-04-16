package com.localkart.controller;

import com.localkart.dto.ProductDTO;
import com.localkart.entity.User;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.ProductService;
import com.localkart.service.UserService;
import com.localkart.util.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class VendorController {

    private final UserService userService;
    private final ProductService productService;

    public VendorController(UserService userService, ProductService productService) {
        this.userService = userService;
        this.productService = productService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User vendor = userService.findById(userDetails.getUserId()).orElse(null);
        if (vendor == null) return ResponseEntity.status(404).body(new ApiResponse("error", "Vendor not found", null));
        
        Page<ProductDTO> products = productService.getProductsByCategory(null, PageRequest.of(0, 10)); // Simplified
        
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("vendorProfile", vendor);
        dashboard.put("totalProducts", products.getTotalElements());
        
        return ResponseEntity.ok(new ApiResponse("success", "Dashboard data retrieved", dashboard));
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody ProductDTO productDTO) {
        productDTO.setVendorId(userDetails.getUserId());
        ProductDTO created = productService.addProduct(productDTO);
        return ResponseEntity.status(201).body(new ApiResponse("success", "Product added", created));
    }
}
