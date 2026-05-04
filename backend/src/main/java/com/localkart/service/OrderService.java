package com.localkart.service;

import com.localkart.dto.OrderRequestDTO;
import com.localkart.dto.OrderItemDTO;
import com.localkart.entity.*;
import com.localkart.repository.OrderRepository;
import com.localkart.repository.ProductRepository;
import com.localkart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order createOrder(Integer userId, OrderRequestDTO requestDTO) {
        User customer = userRepository.findById(userId).orElse(null);
        if (customer == null) return null;
        if (requestDTO.getItems() == null || requestDTO.getItems().isEmpty()) return null;

        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus("Pending");
        order.setDeliveryFullName(requestDTO.getDeliveryFullName());
        order.setDeliveryAddress(requestDTO.getDeliveryAddress());
        order.setDeliveryCity(requestDTO.getDeliveryCity());
        order.setDeliveryZipCode(requestDTO.getDeliveryZipCode());
        order.setDeliveryPhone(requestDTO.getDeliveryPhone());
        order.setDeliveryEmail(requestDTO.getDeliveryEmail());
        order.setPaymentMethod(requestDTO.getPaymentMethod());
        order.setTransactionId(requestDTO.getTransactionId());
        order.setPaymentStatus("PENDING");
        order.setOrderNumber("ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        // Initialize the list if your Entity doesn't initialize it
        if (order.getItems() == null) {
            order.setItems(new ArrayList<>());
        }

        double subtotal = 0;
        for (OrderItemDTO itemDTO : requestDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId()).orElse(null);
            
            if (product != null && product.getIsActive() && product.getStock() >= itemDTO.getQuantity()) {
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(product);
                item.setQuantity(itemDTO.getQuantity());
                item.setPrice(product.getPrice());
                item.setTotal(product.getPrice() * itemDTO.getQuantity());
                
                subtotal += item.getTotal();

                // Inventory Update
                product.setStock(product.getStock() - itemDTO.getQuantity());
                product.setSoldCount((product.getSoldCount() != null ? product.getSoldCount() : 0) + itemDTO.getQuantity());
                productRepository.save(product);

                order.getItems().add(item);
            }
        }

        if (order.getItems().isEmpty()) return null;

        order.setSubtotal(subtotal);
        order.setDeliveryCharge(subtotal > 500 ? 0.0 : 40.0);
        order.setTotal(order.getSubtotal() + order.getDeliveryCharge());
        order.setDistanceKm(Math.round((Math.random() * 5 + 0.5) * 10.0) / 10.0);

        if ("PAID".equalsIgnoreCase(requestDTO.getPaymentMethod()) ||
            "RAZORPAY".equalsIgnoreCase(requestDTO.getPaymentMethod()) ||
            requestDTO.getTransactionId() != null) {
            order.setPaymentStatus("PAID");
        }

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(Integer userId) {
        return userRepository.findById(userId)
                .map(orderRepository::findByCustomerOrderByCreatedAtDesc)
                .orElse(List.of());
    }

    public List<Order> getOrdersByVendor(Integer vendorId) {
        return userRepository.findById(vendorId)
                .map(orderRepository::findByVendor)
                .orElse(List.of());
    }

    public List<Order> getOrdersByDeliveryPartner(Integer deliveryPartnerId) {
        return userRepository.findById(deliveryPartnerId)
                .map(orderRepository::findByDeliveryPartnerOrderByCreatedAtDesc)
                .orElse(List.of());
    }

    public List<Order> getAvailableOrders() {
        return orderRepository.findByStatusOrderByCreatedAtDesc("Pending");
    }

    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    public Order updateOrderStatus(Integer orderId, String status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }

    @Transactional
    public Order acceptOrderByDelivery(Integer orderId, Integer deliveryPartnerId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return null;
        if (!"Pending".equals(order.getStatus())) return null;

        User deliveryPartner = userRepository.findById(deliveryPartnerId).orElse(null);
        if (deliveryPartner == null) return null;

        order.setDeliveryPartner(deliveryPartner);
        order.setStatus("Accepted");
        return orderRepository.save(order);
    }

    @Transactional
    public Order completeOrderByDelivery(Integer orderId, Integer deliveryPartnerId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return null;
        if (order.getDeliveryPartner() == null ||
            !order.getDeliveryPartner().getId().equals(deliveryPartnerId)) {
            return null;
        }
        order.setStatus("Delivered");
        order.setPaymentStatus("PAID");
        return orderRepository.save(order);
    }
}