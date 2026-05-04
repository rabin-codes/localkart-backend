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

import java.util.Arrays;
import java.util.Collections;

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
        if (categoryId == null) return Page.empty();
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

    public Page<ProductDTO> getProductsByVendor(Integer vendorId, Pageable pageable) {
        User vendor = userRepository.findById(vendorId).orElse(null);
        if (vendor == null) return Page.empty();
        return productRepository.findByVendor(vendor, pageable).map(this::convertToDTO);
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

    public ProductDTO updateProductForVendor(Integer productId, ProductDTO productDTO, Integer vendorId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return null;
        if (product.getVendor() == null || !product.getVendor().getId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized: Product does not belong to this vendor");
        }
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

    public boolean deleteProductForVendor(Integer productId, Integer vendorId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return false;
        if (product.getVendor() == null || !product.getVendor().getId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized: Product does not belong to this vendor");
        }
        product.setIsActive(false);
        productRepository.save(product);
        return true;
    }

    private void updateProductFields(Product product, ProductDTO dto) {
        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getOriginalPrice() != null) product.setOriginalPrice(dto.getOriginalPrice());
        
        // Stock Handling
        if (dto.getStock() != null) {
            product.setStock(dto.getStock());
        } else if (product.getStock() == null) {
            product.setStock(0);
        }

        // Image Handling: Support for both URLs and local file names
        if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
            product.setImage(dto.getImageUrl());
        }
        
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            product.setAdditionalImages(String.join(",", dto.getImageUrls()));
            if (product.getImage() == null) {
                product.setImage(dto.getImageUrls().get(0));
            }
        }

        // Reliable Fallback (picsum.photos is rarely blocked compared to via.placeholder)
        if (product.getImage() == null || product.getImage().trim().isEmpty()) {
            product.setImage("https://picsum.photos/400/300?random=" + (int)(Math.random() * 100));
        }

        if (dto.getIsActive() != null) {
            product.setIsActive(dto.getIsActive());
        } else if (product.getIsActive() == null) {
            product.setIsActive(true);
        }

        if (dto.getCategoryId() != null) {
            categoryRepository.findById(dto.getCategoryId()).ifPresent(product::setCategory);
        }
        if (dto.getVendorId() != null) {
            userRepository.findById(dto.getVendorId()).ifPresent(product::setVendor);
        }
    }

    public ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImage());
        dto.setRating(product.getRating() != null ? product.getRating() : 0.0);
        dto.setReviewCount(product.getReviews() != null ? product.getReviews() : 0);
        dto.setSoldCount(product.getSoldCount() != null ? product.getSoldCount() : 0);
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        if (product.getAdditionalImages() != null && !product.getAdditionalImages().isBlank()) {
            dto.setImageUrls(Arrays.asList(product.getAdditionalImages().split(",")));
        } else if (product.getImage() != null) {
            dto.setImageUrls(Collections.singletonList(product.getImage()));
        }

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        if (product.getVendor() != null) {
            dto.setVendorId(product.getVendor().getId());
            dto.setVendorName(product.getVendor().getName());
            dto.setShopName(product.getVendor().getShopName());
        }

        return dto;
    }
}