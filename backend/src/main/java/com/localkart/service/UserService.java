package com.localkart.service;

import com.localkart.dto.AuthRequest;
import com.localkart.dto.AuthResponse;
import com.localkart.entity.User;
import com.localkart.entity.Vendor;
import com.localkart.entity.DeliveryPartner;
import com.localkart.repository.UserRepository;
import com.localkart.repository.VendorRepository;
import com.localkart.repository.DeliveryPartnerRepository;
import com.localkart.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserService(UserRepository userRepository,
                       VendorRepository vendorRepository,
                       DeliveryPartnerRepository deliveryPartnerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
        this.deliveryPartnerRepository = deliveryPartnerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtTokenProvider.generateToken(user.getId(), user.getRole());
                user.setRole(user.getRole().toUpperCase());
                user.setPassword(null); 
                return new AuthResponse("success", "Login successful", token, user);
            }
        }
        return new AuthResponse("error", "Invalid email or password", null, null);
    }

    @Transactional
    public AuthResponse signup(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return new AuthResponse("error", "Email already exists", null, null);
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole() != null ? user.getRole().toUpperCase() : "CUSTOMER");
        
        User savedUser = userRepository.save(user);

        if ("VENDOR".equals(savedUser.getRole())) {
            Vendor vendor = new Vendor();
            vendor.setUser(savedUser);
            vendor.setShopName(user.getShopName() != null ? user.getShopName() : savedUser.getName() + "'s Shop");
            vendorRepository.save(vendor);
        } else if ("DELIVERY".equals(savedUser.getRole())) {
            DeliveryPartner partner = new DeliveryPartner();
            partner.setUser(savedUser);
            partner.setVehicleType(user.getVehicleType());
            partner.setLicenseNumber(user.getLicenseNumber());
            deliveryPartnerRepository.save(partner);
        }
        
        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getRole());

        // Create response user to avoid Hibernate sync issues with null password
        User responseUser = new User();
        responseUser.setId(savedUser.getId());
        responseUser.setName(savedUser.getName());
        responseUser.setEmail(savedUser.getEmail());
        responseUser.setRole(savedUser.getRole());

        return new AuthResponse("success", "Registration successful", token, responseUser);
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id).map(u -> {
            u.setPassword(null);
            return u;
        });
    }

    @Transactional
    public User updateProfile(Integer userId, User updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.getName() != null) user.setName(updates.getName());
        if (updates.getPhone() != null) user.setPhone(updates.getPhone());
        if (updates.getAddress() != null) user.setAddress(updates.getAddress());
        if (updates.getCity() != null) user.setCity(updates.getCity());
        if (updates.getZipCode() != null) user.setZipCode(updates.getZipCode());
        
        // Handle role-specific logic during update
        if ("VENDOR".equals(user.getRole()) && updates.getShopName() != null) {
            vendorRepository.findByUser(user).ifPresent(v -> {
                v.setShopName(updates.getShopName());
                vendorRepository.save(v);
            });
        }

        if (updates.getPassword() != null && !updates.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updates.getPassword()));
        }

        User saved = userRepository.save(user);
        saved.setPassword(null);
        return saved;
    }
}