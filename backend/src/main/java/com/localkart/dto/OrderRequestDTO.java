package com.localkart.dto;

import java.util.List;

public class OrderRequestDTO {
    private String deliveryFullName;
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryZipCode;
    private String deliveryPhone;
    private String deliveryEmail;
    private String paymentMethod;
    private String transactionId;
    private Double totalAmount;
    private List<OrderItemDTO> items;

    public OrderRequestDTO() {}

    // Getters and Setters
    public String getDeliveryFullName() { return deliveryFullName; }
    public void setDeliveryFullName(String deliveryFullName) { this.deliveryFullName = deliveryFullName; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getDeliveryCity() { return deliveryCity; }
    public void setDeliveryCity(String deliveryCity) { this.deliveryCity = deliveryCity; }

    public String getDeliveryZipCode() { return deliveryZipCode; }
    public void setDeliveryZipCode(String deliveryZipCode) { this.deliveryZipCode = deliveryZipCode; }

    public String getDeliveryPhone() { return deliveryPhone; }
    public void setDeliveryPhone(String deliveryPhone) { this.deliveryPhone = deliveryPhone; }

    public String getDeliveryEmail() { return deliveryEmail; }
    public void setDeliveryEmail(String deliveryEmail) { this.deliveryEmail = deliveryEmail; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}