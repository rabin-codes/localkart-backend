package com.localkart.service;

import com.localkart.dto.CartDTO;
import com.localkart.entity.Cart;
import com.localkart.entity.CartItem;
import com.localkart.entity.Product;
import com.localkart.entity.User;
import com.localkart.repository.CartRepository;
import com.localkart.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Cart getCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    public CartDTO getCartDTO(User user) {
        Cart cart = getCart(user);
        return convertToDTO(cart);
    }

    @Transactional
    public CartDTO addItem(User user, Integer productId, Integer quantity) {
        Cart cart = getCart(user);
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return convertToDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO updateItem(User user, Integer productId, Integer quantity) {
        Cart cart = getCart(user);
        cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst()
            .ifPresent(item -> {
                if (quantity <= 0) {
                    cart.getItems().remove(item);
                } else {
                    item.setQuantity(quantity);
                }
            });
        return convertToDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO removeItem(User user, Integer productId) {
        Cart cart = getCart(user);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return convertToDTO(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = getCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public CartDTO convertToDTO(Cart cart) {
        List<CartDTO.CartItemDTO> itemDTOs = cart.getItems().stream().map(item -> {
            Product p = item.getProduct();
            double subtotal = p.getPrice() * item.getQuantity();
            return new CartDTO.CartItemDTO(
                    item.getId(),
                    p.getId(),
                    p.getName(),
                    p.getImage(),
                    p.getPrice(),
                    item.getQuantity(),
                    subtotal,
                    p.getStock()
            );
        }).collect(Collectors.toList());

        double totalPrice = itemDTOs.stream().mapToDouble(CartDTO.CartItemDTO::getSubtotal).sum();
        int itemCount = itemDTOs.stream().mapToInt(CartDTO.CartItemDTO::getQuantity).sum();

        return new CartDTO(cart.getId(), itemDTOs, totalPrice, itemCount);
    }
}
