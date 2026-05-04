package com.localkart.repository;

import com.localkart.entity.User;
import com.localkart.entity.UserBehavior;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBehaviorRepository extends JpaRepository<UserBehavior, Long> {

    List<UserBehavior> findByUserOrderByOrderCountDesc(User user);

    Optional<UserBehavior> findByUserAndProductId(User user, Integer productId);

    @Query("SELECT ub FROM UserBehavior ub WHERE ub.user = :user ORDER BY ub.lastOrderedAt DESC")
    List<UserBehavior> findRecentBehaviors(User user);

    @Query("SELECT ub FROM UserBehavior ub WHERE ub.user = :user AND ub.orderCount >= :minCount ORDER BY ub.orderCount DESC")
    List<UserBehavior> findFrequentlyOrderedProducts(User user, int minCount);
}
