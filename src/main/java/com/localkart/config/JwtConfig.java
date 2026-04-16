package com.localkart.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT Configuration Properties
 * Reads JWT settings from application.properties
 */
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    private String secret;
    private long expiration; // in milliseconds
    private String tokenPrefix = "Bearer ";
    private String headerString = "Authorization";

    // Getters and Setters

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    public String getTokenPrefix() {
        return tokenPrefix;
    }

    public void setTokenPrefix(String tokenPrefix) {
        this.tokenPrefix = tokenPrefix;
    }

    public String getHeaderString() {
        return headerString;
    }

    public void setHeaderString(String headerString) {
        this.headerString = headerString;
    }
}
