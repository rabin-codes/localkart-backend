package com.localkart.service;

import com.localkart.dto.AuthRequest;
import com.localkart.dto.AuthResponse;
import com.localkart.entity.User;
import com.localkart.repository.UserRepository;
import com.localkart.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtTokenProvider.generateToken(user.getId(), user.getRole());
                return new AuthResponse("success", "Login successful", token, user);
            }
        }
        return new AuthResponse("error", "Invalid email or password", null, null);
    }

    public AuthResponse signup(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return new AuthResponse("error", "Email already exists", null, null);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository. userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getRole());
        return new AuthResponse("success", "User registered successfully", token, savedUser);
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
