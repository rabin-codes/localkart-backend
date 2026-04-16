package com.localkart.service;

import com.localkart.dto.ProductDTO;
import com.localkart.entity.Category;
import com.localkart.entity.Product;
import com.localkart.entity.User;
import com.localkart.repository.CategoryRepository;
import com.localkart.repository.ProductRepository;
import com.localkart.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service class for Product operations
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, 
                          CategoryRepository categoryRepository, 
                          UserRepository userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable).map(this::convertToDTO);
    }

    public ProductDTO getProductById(Integer productId) {
        return productRepository.findById(productId).map(this::convertToDTO).orElse(null);
    }

    public Page<ProductDTO> getProductsByCategory(String categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category == null) return Page.empty();
        return productRepository.findByCategoryAndIsActiveTrue(category, pageable).map(this::convertToDTO);
    }

    public Page<ProductDTO> searchProducts(String query, Pageable pageable) {
        return productRepository.searchProducts(query, pageable).map(this::convertToDTO);
    }

    public Page<ProductDTO> getActiveProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable).map(this::convertToDTO);
    }

    public ProductDTO addProduct(ProductDTO productDTO) {
        Product product = new Product();
        updateProductFields(product, productDTO);
        Product saved = productRepository.save(product);
        return convertToDTO(saved);
    }

    public ProductDTO updateProduct(ProductDTO productDTO) {
        Product product = productRepository.findById(productDTO.getId()).orElse(null);
        if (product == null) return null;
        updateProductFields(product, productDTO);
        Product saved = productRepository.save(product);
        return convertToDTO(saved);
    }

    public boolean deleteProduct(Integer productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return false;
        product.setIsActive(false);
        productRepository.save(product);
        return true;
    }

    public Page<ProductDTO> getFeaturedProducts(Pageable pageable) {
        // For simplicity, just return active products sorted (maybe add a featured flag later)
        return productRepository.findByIsActiveTrue(pageable).map(this::convertToDTO);
    }

    private void updateProductFields(Product product, ProductDTO dto) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImage(dto.getImageUrl());
        if (dto.getIsActive() != null) product.setIsActive(dto.getIsActive());
        
        if (dto.getCategoryId() != null) {
            categoryRepository.findById(dto.getCategoryId()).ifPresent(product::setCategory);
        }
        if (dto.getVendorId() != null) {
            userRepository.findById(dto.getVendorId()).ifPresent(product::setVendor);
        }
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImage());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviews());
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        if (product.getVendor() != null) {
            dto.setVendorId(product.getVendor().getId());
            dto.setVendorName(product.getVendor().getName());
        }
        
        return dto;
    }
}
