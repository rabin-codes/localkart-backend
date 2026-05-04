package com.localkart.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_behaviors")
@NoArgsConstructor
@AllArgsConstructor
public class UserBehavior {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer categoryId;       // Which category was ordered from
    private String categoryName;      // Readable name
    private Integer orderCount;       // How many times this product was ordered
    private Integer dayOfWeek;        // Which day (1=Monday, 7=Sunday) user usually orders
    private Integer weekOfMonth;      // Week of month pattern

    private LocalDateTime lastOrderedAt;
    private LocalDateTime nextPredictedOrder; // ML prediction: when they'll next need it

    @Column(columnDefinition = "TEXT")
    private String predictionReason;  // "You order this every Sunday"

    @PrePersist
    protected void onCreate() {
        lastOrderedAt = LocalDateTime.now();
        if (orderCount == null) orderCount = 1;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public Integer getOrderCount() { return orderCount; }
    public void setOrderCount(Integer orderCount) { this.orderCount = orderCount; }
    public Integer getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public Integer getWeekOfMonth() { return weekOfMonth; }
    public void setWeekOfMonth(Integer weekOfMonth) { this.weekOfMonth = weekOfMonth; }
    public LocalDateTime getLastOrderedAt() { return lastOrderedAt; }
    public void setLastOrderedAt(LocalDateTime lastOrderedAt) { this.lastOrderedAt = lastOrderedAt; }
    public LocalDateTime getNextPredictedOrder() { return nextPredictedOrder; }
    public void setNextPredictedOrder(LocalDateTime nextPredictedOrder) { this.nextPredictedOrder = nextPredictedOrder; }
    public String getPredictionReason() { return predictionReason; }
    public void setPredictionReason(String predictionReason) { this.predictionReason = predictionReason; }
}
