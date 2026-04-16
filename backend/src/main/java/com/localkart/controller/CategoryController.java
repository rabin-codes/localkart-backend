package com.localkart.controller;

import com.localkart.dto.CategoryDTO;
import com.localkart.service.CategoryService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        Map<String, Object> response = new HashMap<>();
        response.put("content", categories);
        response.put("totalCategories", categories.size());
        return ResponseEntity.ok(new ApiResponse("success", "Categories retrieved", response));
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<?> getCategoryById(@PathVariable String categoryId) {
        CategoryDTO categoryDTO = categoryService.getCategoryById(categoryId);
        if (categoryDTO == null) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse("error", "Category not found", null));
        }
        return ResponseEntity.ok(new ApiResponse("success", "Category retrieved", categoryDTO));
    }
}
