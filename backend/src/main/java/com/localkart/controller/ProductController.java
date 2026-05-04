package com.localkart.controller;

import com.localkart.dto.ProductDTO;
import com.localkart.service.ProductService;
import com.localkart.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductDTO> products;

            if (search != null && !search.isBlank()) {
                products = productService.searchProducts(search, pageable);
            } else if (category != null && !category.isBlank()) {
                products = productService.getProductsByCategory(category, pageable);
            } else {
                products = productService.getAllProducts(pageable);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("content", products.getContent());
            response.put("currentPage", products.getNumber());
            response.put("totalProducts", products.getTotalElements());
            response.put("totalPages", products.getTotalPages());
            response.put("hasNext", products.hasNext());
            response.put("hasPrevious", products.hasPrevious());

            return ResponseEntity.ok(new ApiResponse("success", "Products retrieved", response));
        } catch (Exception e) {
            logger.error("Error fetching products: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("error", "Failed to fetch products", null));
        }
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable Integer productId) {
        ProductDTO productDTO = productService.getProductById(productId);
        if (productDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("error", "Product not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Product retrieved", productDTO));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(
            @PathVariable String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = productService.getProductsByCategory(categoryId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", products.getContent());
        response.put("currentPage", products.getNumber());
        response.put("totalProducts", products.getTotalElements());
        response.put("totalPages", products.getTotalPages());

        return ResponseEntity.ok(new ApiResponse("success", "Products retrieved", response));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = productService.searchProducts(query, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", products.getContent());
        response.put("query", query);
        response.put("currentPage", products.getNumber());
        response.put("totalResults", products.getTotalElements());

        return ResponseEntity.ok(new ApiResponse("success", "Search results", response));
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO created = productService.addProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("success", "Product created", created));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer productId,
                                           @RequestBody ProductDTO productDTO) {
        productDTO.setId(productId);
        ProductDTO updated = productService.updateProduct(productDTO);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("error", "Product not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Product updated", updated));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer productId) {
        boolean success = productService.deleteProduct(productId);
        if (!success) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("error", "Product not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Product deleted", null));
    }
}
