package com.localkart.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    @Column(nullable = false)
    private String status; // Pending, Accepted, Out for Delivery, Delivered, Cancelled

    @Column(nullable = false)
    private Double subtotal;
    
    @Column(nullable = false)
    private Double deliveryCharge;
    
    @Column(nullable = false)
    private Double total;

    // Payment details
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;

    // Delivery address details
    private String deliveryFullName;
    private String deliveryEmail;
    private String deliveryPhone;
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryZipCode;

    private Double distanceKm;
    private Integer rating;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "delivery_partner_id")
    private User deliveryPartner;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (orderNumber == null) {
            orderNumber = "ORD" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
