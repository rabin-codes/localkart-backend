package com.localkart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * LocalKart - E-Commerce Platform
 * Main Spring Boot Application Entry Point
 * 
 * Backend runs on: http://localhost:8080/api
 * Frontend runs on: http://localhost:3000
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.localkart")
public class LocalkartApplication {

    public static void main(String[] args) {
        SpringApplication.run(LocalkartApplication.class, args);
        System.out.println("========================================");
        System.out.println("LocalKart Backend Started Successfully");
        System.out.println("========================================");
        System.out.println("API Base URL: http://localhost:8080/api");
        System.out.println("Swagger UI: http://localhost:8080/api/swagger-ui.html");
        System.out.println("========================================");
    }
}
