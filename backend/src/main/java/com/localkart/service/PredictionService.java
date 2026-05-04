package com.localkart.service;

import com.localkart.dto.PredictionDTO;
import com.localkart.entity.*;
import com.localkart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    private final UserBehaviorRepository userBehaviorRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public PredictionService(UserBehaviorRepository userBehaviorRepository,
                             OrderRepository orderRepository,
                             ProductRepository productRepository,
                             UserRepository userRepository) {
        this.userBehaviorRepository = userBehaviorRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /**
     * Called after every order to update user behavior tracking
     */
    @Transactional
    public void trackOrderBehavior(User user, List<OrderItem> items) {
        LocalDateTime now = LocalDateTime.now();
        int dayOfWeek = now.getDayOfWeek().getValue(); // 1=Mon, 7=Sun
        int weekOfMonth = (now.getDayOfMonth() - 1) / 7 + 1;

        for (OrderItem item : items) {
            Product product = item.getProduct();
            if (product == null) continue;

            Optional<UserBehavior> existingOpt = userBehaviorRepository.findByUserAndProductId(user, product.getId());
            UserBehavior behavior;

            if (existingOpt.isPresent()) {
                behavior = existingOpt.get();
                behavior.setOrderCount(behavior.getOrderCount() + 1);
                behavior.setDayOfWeek(dayOfWeek);
                behavior.setWeekOfMonth(weekOfMonth);

                // Predict next order based on average interval
                long daysSinceLast = ChronoUnit.DAYS.between(behavior.getLastOrderedAt(), now);
                int avgInterval = (int) Math.max(1, daysSinceLast / behavior.getOrderCount());
                behavior.setNextPredictedOrder(now.plusDays(avgInterval));
                behavior.setLastOrderedAt(now);
            } else {
                behavior = new UserBehavior();
                behavior.setUser(user);
                behavior.setProduct(product);
                behavior.setOrderCount(1);
                behavior.setDayOfWeek(dayOfWeek);
                behavior.setWeekOfMonth(weekOfMonth);
                behavior.setLastOrderedAt(now);
                behavior.setNextPredictedOrder(now.plusDays(7)); // Default: weekly

                if (product.getCategory() != null) {
                    behavior.setCategoryName(product.getCategory().getName());
                }
            }

            // Generate human-readable prediction reason
            behavior.setPredictionReason(generateReason(behavior, dayOfWeek));
            userBehaviorRepository.save(behavior);
        }
    }

    /**
     * Get AI predictions for a user
     */
    public List<PredictionDTO> getPredictions(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();

        List<UserBehavior> behaviors = userBehaviorRepository.findByUserOrderByOrderCountDesc(user);
        LocalDateTime now = LocalDateTime.now();
        List<PredictionDTO> predictions = new ArrayList<>();

        for (UserBehavior b : behaviors) {
            if (b.getProduct() == null || !b.getProduct().getIsActive()) continue;

            long daysSinceLast = ChronoUnit.DAYS.between(b.getLastOrderedAt(), now);
            long daysUntilNext = b.getNextPredictedOrder() != null
                    ? ChronoUnit.DAYS.between(now, b.getNextPredictedOrder())
                    : 7;

            // Only include if prediction is relevant (product needed soon or overdue)
            if (daysUntilNext > 14) continue;

            Product p = b.getProduct();
            PredictionDTO dto = new PredictionDTO();
            dto.setProductId(p.getId());
            dto.setProductName(p.getName());
            dto.setProductImage(p.getImage());
            dto.setProductPrice(p.getPrice());
            dto.setCategoryName(b.getCategoryName());
            dto.setReason(b.getPredictionReason());
            dto.setDaysSinceLastOrder((int) daysSinceLast);
            dto.setAverageOrderIntervalDays(calculateAvgInterval(b));

            // Urgency
            if (daysUntilNext <= 0) dto.setUrgency("HIGH");
            else if (daysUntilNext <= 3) dto.setUrgency("MEDIUM");
            else dto.setUrgency("LOW");

            // Confidence based on order count
            double confidence = Math.min(0.95, 0.3 + (b.getOrderCount() * 0.1));
            dto.setConfidence(Math.round(confidence * 100.0) / 100.0);

            predictions.add(dto);
        }

        // Sort by urgency
        return predictions.stream()
                .sorted((a, b2) -> compareUrgency(a.getUrgency(), b2.getUrgency()))
                .limit(10)
                .collect(Collectors.toList());
    }

    private String generateReason(UserBehavior b, int currentDayOfWeek) {
        String[] days = {"", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
        String dayName = (b.getDayOfWeek() != null && b.getDayOfWeek() >= 1 && b.getDayOfWeek() <= 7)
                ? days[b.getDayOfWeek()] : "regularly";

        if (b.getOrderCount() >= 4) {
            return "You order " + (b.getProduct() != null ? b.getProduct().getName() : "this") + " every " + dayName;
        } else if (b.getOrderCount() >= 2) {
            return "You've ordered this " + b.getOrderCount() + " times – might need a refill!";
        } else {
            return "Based on your recent orders, you may need this soon";
        }
    }

    private int calculateAvgInterval(UserBehavior b) {
        if (b.getOrderCount() <= 1) return 7;
        long totalDays = ChronoUnit.DAYS.between(b.getLastOrderedAt().minusDays(7L * b.getOrderCount()), b.getLastOrderedAt());
        return (int) Math.max(1, totalDays / b.getOrderCount());
    }

    private int compareUrgency(String a, String b) {
        int aScore = "HIGH".equals(a) ? 0 : "MEDIUM".equals(a) ? 1 : 2;
        int bScore = "HIGH".equals(b) ? 0 : "MEDIUM".equals(b) ? 1 : 2;
        return Integer.compare(aScore, bScore);
    }
}
