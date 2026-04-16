package com.localkart.security;

import com.localkart.config.JwtConfig;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT Token Provider
 * Generates, validates, and extracts claims from JWT tokens
 * Updated for JJWT 0.12.x
 */
@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final JwtConfig jwtConfig;

    public JwtTokenProvider(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    /**
     * Generate JWT token for user
     * @param userId User ID
     * @param userRole User role
     * @return JWT token
     */
    public String generateToken(Integer userId, String userRole) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("role", userRole)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validate JWT token
     * @param token JWT token
     * @return true if valid
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Get user ID from token
     * @param token JWT token
     * @return User ID
     */
    public Integer getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return Integer.parseInt(claims.getSubject());
    }

    /**
     * Get user role from token
     * @param token JWT token
     * @return User role
     */
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("role", String.class);
    }

    /**
     * Check if token is expired
     * @param token JWT token
     * @return true if expired
     */
    public boolean isTokenExpired(String token) {
        Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * Get expiration date from token
     * @param token JWT token
     * @return Expiration date
     */
    public Date getExpirationDateFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getExpiration();
    }

    /**
     * Get all claims from token
     * @param token JWT token
     * @return Claims
     */
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Get signing key
     * @return Signing key
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8));
    }
}
