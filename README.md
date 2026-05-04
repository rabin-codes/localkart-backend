# LocalKart Full-Stack Platform

A hyperlocal e-commerce platform built with React (Frontend) and Spring Boot (Backend).

## Quick Start

1. **Prerequisites**:
   - MySQL Server 8.0+
   - Node.js 18+
   - Java 17+

2. **Database Setup**:
   - Create a database named `localkart_db` in your MySQL server.
   - The application is configured to use:
     - **URL**: `jdbc:mysql://localhost:3306/localkart_db`
     - **Username**: `root`
     - **Password**: Provided via environment variables or local `application.properties`.

3. **Run the Project**:
   - Open PowerShell in the root directory.
   - Run the unified runner script:
     ```powershell
     ./run-project.ps1
     ```
   - This script will:
     - Install frontend dependencies if missing.
     - Start the Spring Boot backend on port 8080.
     - Start the Vite frontend on port 3000.
     - Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Spring Boot 3.2, Spring Security (JWT), Spring Data JPA.
- **Database**: MySQL 8.0.

## Recent Fixes
- Resolved MySQL 8 connection issues (SSL/Public Key retrieval).
- Fixed `WeakKeyException` in JWT authentication by upgrading to a 512-bit secret key.
- Fixed 500 error on Vendor Signup.
- Synchronized Dev/Prod property profiles.
