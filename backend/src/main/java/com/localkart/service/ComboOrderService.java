package com.localkart.service;

import com.localkart.dto.ComboOrderDTO;
import com.localkart.entity.*;
import com.localkart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ComboOrderService {

    private final ComboOrderRepository comboOrderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ComboOrderService(ComboOrderRepository comboOrderRepository,
                             ProductRepository productRepository,
                             UserRepository userRepository) {
        this.comboOrderRepository = comboOrderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ComboOrder createComboOrder(Integer userId, ComboOrderDTO dto) {
        User customer = userRepository.findById(userId).orElse(null);
        if (customer == null) throw new RuntimeException("User not found");
        if (dto.getItems() == null || dto.getItems().isEmpty()) throw new RuntimeException("No items in combo order");

        ComboOrder comboOrder = new ComboOrder();
        comboOrder.setCustomer(customer);
        comboOrder.setComboName(dto.getComboName() != null ? dto.getComboName() : "My Combo");
        comboOrder.setDeliveryAddress(dto.getDeliveryAddress());
        comboOrder.setDeliveryCity(dto.getDeliveryCity());
        comboOrder.setDeliveryPhone(dto.getDeliveryPhone());
        comboOrder.setPaymentMethod(dto.getPaymentMethod());
        comboOrder.setOrderNumber("COMBO" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Set<Integer> vendorIds = new HashSet<>();
        double total = 0;

        for (ComboOrderDTO.ComboItemRequest itemReq : dto.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId()).orElse(null);
            if (product == null || !product.getIsActive()) continue;
            if (product.getStock() < itemReq.getQuantity()) continue;

            ComboItem item = new ComboItem();
            item.setComboOrder(comboOrder);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice());
            item.setTotal(product.getPrice() * itemReq.getQuantity());

            if (product.getVendor() != null) {
                item.setVendor(product.getVendor());
                item.setShopName(product.getVendor().getShopName() != null ? product.getVendor().getShopName() : product.getVendor().getName());
                vendorIds.add(product.getVendor().getId());
            }

            // Update stock
            product.setStock(product.getStock() - itemReq.getQuantity());
            product.setSoldCount(product.getSoldCount() + itemReq.getQuantity());
            productRepository.save(product);

            comboOrder.getItems().add(item);
            total += item.getTotal();
        }

        if (comboOrder.getItems().isEmpty()) throw new RuntimeException("No valid items found");

        comboOrder.setTotalAmount(total);
        comboOrder.setDeliveryCharge(total > 500 ? 0.0 : 40.0); // Single flat delivery fee!
        comboOrder.setGrandTotal(total + comboOrder.getDeliveryCharge());
        comboOrder.setShopCount(vendorIds.size());

        return comboOrderRepository.save(comboOrder);
    }

    public List<ComboOrder> getUserComboOrders(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();
        return comboOrderRepository.findByCustomerOrderByCreatedAtDesc(user);
    }

    public List<ComboOrder> getAvailableComboOrders() {
        return comboOrderRepository.findByStatusOrderByCreatedAtDesc("Pending");
    }

    @Transactional
    public ComboOrder updateStatus(Long orderId, String status) {
        ComboOrder order = comboOrderRepository.findById(orderId).orElse(null);
        if (order == null) throw new RuntimeException("Combo order not found");
        order.setStatus(status);
        return comboOrderRepository.save(order);
    }

    @Transactional
    public ComboOrder acceptByDelivery(Long orderId, Integer deliveryPartnerId) {
        ComboOrder order = comboOrderRepository.findById(orderId).orElse(null);
        if (order == null) throw new RuntimeException("Combo order not found");
        if (!"Pending".equals(order.getStatus())) throw new RuntimeException("Order is not available");

        User dp = userRepository.findById(deliveryPartnerId).orElse(null);
        if (dp == null) throw new RuntimeException("Delivery partner not found");

        order.setDeliveryPartner(dp);
        order.setStatus("Accepted");
        return comboOrderRepository.save(order);
    }

    /**
     * Suggest nearby shop combos based on category groupings
     */
    public Map<String, Object> getSuggestedCombos(List<Integer> productIds) {
        Map<String, Object> result = new HashMap<>();
        List<Product> products = productRepository.findAllById(productIds);

        Map<String, List<ProductDTO>> byVendor = new LinkedHashMap<>();
        double totalSavings = 0;

        for (Product p : products) {
            String vendorName = p.getVendor() != null
                    ? (p.getVendor().getShopName() != null ? p.getVendor().getShopName() : p.getVendor().getName())
                    : "Local Shop";

            byVendor.computeIfAbsent(vendorName, k -> new ArrayList<>())
                    .add(new ProductDTO(p.getId(), p.getName(), null, p.getPrice(), null, p.getImage(), null, null, null, null, null, null, null, null, null, null, null, null));
        }

        result.put("shops", byVendor);
        result.put("shopCount", byVendor.size());
        result.put("deliveryFee", 40.0); // Single delivery fee
        result.put("deliverySavings", (byVendor.size() - 1) * 40.0);
        result.put("message", "Save ₹" + ((byVendor.size() - 1) * 40) + " with one delivery from " + byVendor.size() + " shops!");

        return result;
    }

    // Inner DTO class for combo suggestion
    static class ProductDTO {
        public Integer id;
        public String name;
        public String description;
        public Double price;
        public Double originalPrice;
        public String image;
        public List<String> imageUrls;
        public Double rating;
        public Integer reviewCount;
        public Integer stock;
        public Integer soldCount;
        public Boolean isActive;
        public String categoryId;
        public String categoryName;
        public Integer vendorId;
        public String vendorName;
        public String shopName;
        public java.time.LocalDateTime createdAt;
        public java.time.LocalDateTime updatedAt;

        public ProductDTO(Integer id, String name, String description, Double price, Double originalPrice,
                         String image, List<String> imageUrls, Double rating, Integer reviewCount,
                         Integer stock, Integer soldCount, Boolean isActive, String categoryId,
                         String categoryName, Integer vendorId, String vendorName, String shopName,
                         java.time.LocalDateTime createdAt) {
            this.id = id; this.name = name; this.price = price; this.image = image;
        }
    }
}
