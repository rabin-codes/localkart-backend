package com.localkart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


public class CartDTO {
    public CartDTO() {}
    public CartDTO(Long cartId, List<CartItemDTO> items, Double totalPrice, Integer itemCount) {
        this.cartId = cartId;
        this.items = items;
        this.totalPrice = totalPrice;
        this.itemCount = itemCount;
    }
    private Long cartId;
    private List<CartItemDTO> items;
    private Double totalPrice;
    private Integer itemCount;


    public static class CartItemDTO {
        private Long itemId;
        private Integer productId;
        private String productName;
        private String productImage;
        private Double price;
        private Integer quantity;
        private Double subtotal;
        private Integer stock;

        public CartItemDTO() {}
        public CartItemDTO(Long itemId, Integer productId, String productName, String productImage, Double price, Integer quantity, Double subtotal, Integer stock) {
            this.itemId = itemId;
            this.productId = productId;
            this.productName = productName;
            this.productImage = productImage;
            this.price = price;
            this.quantity = quantity;
            this.subtotal = subtotal;
            this.stock = stock;
        }

        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }
        public Integer getProductId() { return productId; }
        public void setProductId(Integer productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getProductImage() { return productImage; }
        public void setProductImage(String productImage) { this.productImage = productImage; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public Double getSubtotal() { return subtotal; }
        public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
        public Integer getStock() { return stock; }
        public void setStock(Integer stock) { this.stock = stock; }
    }

    // Generated Getters and Setters
    public Long getCartId() { return cartId; }
    public void setCartId(Long cartId) { this.cartId = cartId; }
    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public Integer getItemCount() { return itemCount; }
    public void setItemCount(Integer itemCount) { this.itemCount = itemCount; }

}
