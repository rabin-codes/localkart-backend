package com.localkart.service;

import com.localkart.entity.*;
import com.localkart.repository.OrderRepository;
import com.localkart.repository.ProductRepository;
import com.localkart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

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
    public Order createOrder(Integer userId, List<OrderItem> items, Order deliveryDetails) {
        User customer = userRepository.findById(userId).orElse(null);
        if (customer == null) return null;

        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus("Pending");
        
        // Use provided delivery details
        order.setDeliveryFullName(deliveryDetails.getDeliveryFullName());
        order.setDeliveryAddress(deliveryDetails.getDeliveryAddress());
        order.setDeliveryCity(deliveryDetails.getDeliveryCity());
        order.setDeliveryZipCode(deliveryDetails.getDeliveryZipCode());
        order.setDeliveryPhone(deliveryDetails.getDeliveryPhone());
        order.setDeliveryEmail(deliveryDetails.getDeliveryEmail());
        
        order.setPaymentMethod(deliveryDetails.getPaymentMethod());
        order.setPaymentStatus("PENDING");
        order.setOrderNumber("ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        double subtotal = 0;
        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getProduct().getId()).orElse(null);
            if (product != null && product.getStock() >= item.getQuantity()) {
                item.setOrder(order);
                item.setPrice(product.getPrice());
                item.setTotal(product.getPrice() * item.getQuantity());
                subtotal += item.getTotal();
                
                // Update stock
                product.setStock(product.getStock() - item.getQuantity());
                product.setSoldCount(product.getSoldCount() + item.getQuantity());
                productRepository.save(product);
                
                order.getItems().add(item);
            }
        }

        if (order.getItems().isEmpty()) return null;

        order.setSubtotal(subtotal);
        order.setDeliveryCharge(subtotal > 200 ? 0.0 : 40.0);
        order.setTotal(order.getSubtotal() + order.getDeliveryCharge());
        order.setDistanceKm(Math.random() * 5 + 1); // Mock distance

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
}
