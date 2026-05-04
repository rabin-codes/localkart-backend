package com.localkart.service;

import com.localkart.entity.Product;
import com.localkart.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatBotService {

    private final ProductRepository productRepository;

    public ChatBotService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public String getResponse(String query) {
        String q = query.toLowerCase();

        if (q.contains("hello") || q.contains("hi") || q.contains("hey")) {
            return "Hello! I'm your LocalKart Assistant. How can I help you shop local today? 🛒";
        }

        if (q.contains("status") || q.contains("order")) {
            return "You can check your order status in your Dashboard under 'My Orders'. I can also track specific order IDs if you have one!";
        }

        if (q.contains("delivery") || q.contains("time")) {
            return "Most LocalKart deliveries arrive within 30-45 minutes! 🚀 We prioritize fresh and fast handling from your local vendors.";
        }

        if (q.contains("discount") || q.contains("offer")) {
            return "Check out our 'Extra Benefits' section on the landing page for loyalty rewards and free delivery offers! 🎉";
        }
        
        if (q.contains("recommend") || q.contains("product") || q.contains("buy")) {
            List<Product> products = productRepository.findAll();
            if (products.isEmpty()) return "I recommend checking our featured categories for the freshest local goods!";
            
            String recommendations = products.stream()
                .limit(3)
                .map(Product::getName)
                .collect(Collectors.joining(", "));
            return "Based on what's fresh today, I recommend trying: " + recommendations + ". They are favorites in your area! ✨";
        }

        if (q.contains("payment") || q.contains("pay")) {
            return "We support Cash on Delivery (COD) and Online Payments (UPI/Cards). Choose what works best for you at checkout! 💳";
        }

        if (q.contains("vendor") || q.contains("sell")) {
            return "Want to grow your business? Click 'Become a Vendor' on our landing page to start selling to 50k+ local customers! 🏪";
        }

        return "I'm not quite sure about that, but as your LocalKart Assistant, I can help you find products, check delivery times, or explain our features! What else would you like to know? 😊";
    }
}
