package com.localkart.service;

import com.localkart.dto.CategoryDTO;
import com.localkart.entity.Category;
import com.localkart.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Category operations
 */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Get all categories
     * @return List of all categories
     */
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get category by ID
     * @param categoryId Category ID (String)
     * @return Category details
     */
    public CategoryDTO getCategoryById(String categoryId) {
        return categoryRepository.findById(categoryId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImage());
        if (category.getProducts() != null) {
            dto.setProductCount(category.getProducts().size());
        } else {
            dto.setProductCount(0);
        }
        return dto;
    }
}
