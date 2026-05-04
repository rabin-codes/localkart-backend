package com.localkart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "combo_items")
@NoArgsConstructor
@AllArgsConstructor
public class ComboItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_order_id")
    @JsonIgnore
    private ComboOrder comboOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "vendor", "category"})
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User vendor;

    private Integer quantity;
    private Double price;
    private Double total;
    private String shopName;

    // Generated Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ComboOrder getComboOrder() { return comboOrder; }
    public void setComboOrder(ComboOrder comboOrder) { this.comboOrder = comboOrder; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public User getVendor() { return vendor; }
    public void setVendor(User vendor) { this.vendor = vendor; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
}
