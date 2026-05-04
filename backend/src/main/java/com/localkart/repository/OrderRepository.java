package com.localkart.repository;

import com.localkart.entity.Order;
import com.localkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Order> findByDeliveryPartnerOrderByCreatedAtDesc(User deliveryPartner);
    List<Order> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.product.vendor = :vendor ORDER BY o.createdAt DESC")
    List<Order> findByVendor(User vendor);
}
