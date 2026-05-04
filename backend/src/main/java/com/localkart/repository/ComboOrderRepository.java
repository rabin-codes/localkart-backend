package com.localkart.repository;

import com.localkart.entity.ComboOrder;
import com.localkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboOrderRepository extends JpaRepository<ComboOrder, Long> {

    List<ComboOrder> findByCustomerOrderByCreatedAtDesc(User customer);

    List<ComboOrder> findByStatusOrderByCreatedAtDesc(String status);

    List<ComboOrder> findByDeliveryPartnerOrderByCreatedAtDesc(User deliveryPartner);
}
