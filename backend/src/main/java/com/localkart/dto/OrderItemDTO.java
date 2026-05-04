package com.localkart.dto;

public class OrderItemDTO {
    private Integer productId;
    private Integer quantity;
    private Double price;

    // Default Constructor for Jackson
    public OrderItemDTO() {}

    public OrderItemDTO(Integer productId, Integer quantity, Double price) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }

    // Getters and Setters
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}