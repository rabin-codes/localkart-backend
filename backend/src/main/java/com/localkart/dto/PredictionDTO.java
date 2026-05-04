package com.localkart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class PredictionDTO {
    private Integer productId;
    private String productName;
    private String productImage;
    private Double productPrice;
    private String categoryName;
    private String reason;
    private String urgency; // LOW, MEDIUM, HIGH
    private Integer daysSinceLastOrder;
    private Integer averageOrderIntervalDays;
    private Double confidence; // 0.0 to 1.0

    // Generated Getters and Setters
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }
    public Double getProductPrice() { return productPrice; }
    public void setProductPrice(Double productPrice) { this.productPrice = productPrice; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }
    public Integer getDaysSinceLastOrder() { return daysSinceLastOrder; }
    public void setDaysSinceLastOrder(Integer daysSinceLastOrder) { this.daysSinceLastOrder = daysSinceLastOrder; }
    public Integer getAverageOrderIntervalDays() { return averageOrderIntervalDays; }
    public void setAverageOrderIntervalDays(Integer averageOrderIntervalDays) { this.averageOrderIntervalDays = averageOrderIntervalDays; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
}
