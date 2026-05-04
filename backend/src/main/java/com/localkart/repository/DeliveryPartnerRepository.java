package com.localkart.repository;

import com.localkart.entity.DeliveryPartner;
import com.localkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Integer> {
    // Helpful for finding the profile by the linked User
    Optional<DeliveryPartner> findByUser(User user);
    
    // Check if a user already has a partner profile
    boolean existsByUser(User user);
}