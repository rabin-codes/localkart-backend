## LocalKart Backend - Complete Controller Documentation

### Project Structure

```
src/main/java/com/localkart/
├── controller/
│   ├── AuthController.java          # Authentication endpoints
│   ├── UserController.java          # User profile endpoints
│   ├── ProductController.java       # Product catalog endpoints
│   ├── CategoryController.java      # Category management endpoints
│   ├── CartController.java          # Shopping cart endpoints
│   ├── OrderController.java         # Order management endpoints
│   ├── VendorController.java        # Vendor management endpoints
│   └── DeliveryController.java      # Delivery partner endpoints
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── ProductService.java
│   ├── CategoryService.java
│   ├── CartService.java
│   ├── OrderService.java
│   ├── VendorService.java
│   ├── DeliveryService.java
│   └── JwtService.java
├── dto/
│   ├── UserDTO.java
│   ├── ProductDTO.java
│   ├── CategoryDTO.java
│   ├── CartDTO.java
│   ├── OrderDTO.java
│   ├── VendorDTO.java
│   └── DeliveryPartnerDTO.java
├── entity/ (Already created in previous sessions)
├── repository/ (Already created in previous sessions)
└── util/
    └── ApiResponse.java
```

---

## API Endpoints Overview

### 1. AUTH CONTROLLER (`/api/auth`)
**Base URL:** `http://localhost:8080/api/auth`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Customer login |
| POST | `/signup` | Customer registration |
| POST | `/signup/vendor` | Vendor registration |
| POST | `/signup/delivery` | Delivery partner registration |
| POST | `/validate-token` | Validate JWT token |
| POST | `/change-password` | Change user password |
| POST | `/reset-password` | Reset user password |
| POST | `/logout` | User logout |

#### Example Requests:

**Login:**
```bash
POST http://localhost:8080/api/auth/login
Parameters:
  - email: user@example.com
  - password: Password123
  
Response:
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": { UserDTO object }
  }
}
```

**Customer Signup:**
```bash
POST http://localhost:8080/api/auth/signup
Parameters:
  - email: newuser@example.com
  - password: SecurePass123
  - firstName: John
  - lastName: Doe
  - phone: 9876543210
  
Response:
{
  "status": "success",
  "message": "Signup successful",
  "data": {
    "token": "eyJhbGc...",
    "user": { UserDTO object }
  }
}
```

---

### 2. USER CONTROLLER (`/api/users`)
**Base URL:** `http://localhost:8080/api/users`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{userId}` | Get user profile |
| GET | `/email/{email}` | Get user by email |
| PUT | `/{userId}` | Update user profile |
| GET | `/{userId}/profile-completion` | Get profile completion percentage |
| POST | `/{userId}/deactivate` | Deactivate user account |
| GET | `/exists/{email}` | Check if user exists |
| GET | `/{userId}/stats` | Get user statistics |

#### Example Requests:

**Get User Profile:**
```bash
GET http://localhost:8080/api/users/1
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response:
{
  "status": "success",
  "message": "User profile retrieved",
  "data": { UserDTO object }
}
```

**Update User Profile:**
```bash
PUT http://localhost:8080/api/users/1
Parameters:
  - firstName: Jane
  - lastName: Smith
  - phone: 9876543210
  - address: 123 Main St
  - city: New York
  - state: NY
  - postalCode: 10001
  - country: USA
  
Response: { Updated UserDTO }
```

---

### 3. PRODUCT CONTROLLER (`/api/products`)
**Base URL:** `http://localhost:8080/api/products`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all products (paginated) |
| GET | `/{productId}` | Get product by ID |
| GET | `/category/{categoryId}` | Get products by category |
| GET | `/search` | Search products |
| GET | `/active` | Get active products |
| POST | `/` | Add new product |
| PUT | `/{productId}` | Update product |
| DELETE | `/{productId}` | Delete product |
| GET | `/{productId}/availability` | Check product availability |
| GET | `/featured/list` | Get featured products |

#### Example Requests:

**Get All Products:**
```bash
GET http://localhost:8080/api/products?page=0&size=20
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response:
{
  "status": "success",
  "message": "Products retrieved",
  "data": {
    "content": [ ProductDTO array ],
    "currentPage": 0,
    "totalProducts": 150,
    "totalPages": 8,
    "hasNext": true
  }
}
```

**Add New Product:**
```bash
POST http://localhost:8080/api/products
Parameters:
  - vendorId: 1
  - categoryId: 5
  - name: Laptop
  - description: High performance laptop
  - price: 50000
  - discountPercentage: 10
  - stock: 100
  - imageUrl: http://example.com/laptop.jpg
  
Response:
{
  "status": "success",
  "message": "Product created",
  "data": { Created ProductDTO }
}
```

---

### 4. CATEGORY CONTROLLER (`/api/categories`)
**Base URL:** `http://localhost:8080/api/categories`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all categories |
| GET | `/{categoryId}` | Get category by ID |
| POST | `/` | Create new category |
| PUT | `/{categoryId}` | Update category |
| DELETE | `/{categoryId}` | Delete category |
| GET | `/search/{name}` | Get category by name |
| GET | `/{categoryId}/product-count` | Get product count in category |
| GET | `/popular/list` | Get popular categories |

#### Example Requests:

**Get All Categories:**
```bash
GET http://localhost:8080/api/categories
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response:
{
  "status": "success",
  "message": "Categories retrieved",
  "data": {
    "content": [ CategoryDTO array ],
    "totalCategories": 15
  }
}
```

---

### 5. CART CONTROLLER (`/api/cart`)
**Base URL:** `http://localhost:8080/api/cart`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{userId}` | Get user cart |
| POST | `/{userId}/add/{productId}` | Add item to cart |
| PUT | `/{userId}/update/{cartItemId}` | Update item quantity |
| DELETE | `/{userId}/remove/{cartItemId}` | Remove item from cart |
| DELETE | `/{userId}/clear` | Clear entire cart |
| GET | `/{userId}/summary` | Get cart summary |
| GET | `/{userId}/count` | Get items count in cart |
| POST | `/{userId}/apply-coupon` | Apply coupon code |
| POST | `/{userId}/remove-coupon` | Remove coupon |
| GET | `/{userId}/is-empty` | Check if cart is empty |

#### Example Requests:

**Add To Cart:**
```bash
POST http://localhost:8080/api/cart/1/add/5
Parameters:
  - quantity: 2
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response:
{
  "status": "success",
  "message": "Item added to cart",
  "data": { Updated CartDTO }
}
```

**Get Cart Summary:**
```bash
GET http://localhost:8080/api/cart/1/summary
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response:
{
  "status": "success",
  "message": "Cart summary retrieved",
  "data": {
    "userId": 1,
    "totalItems": 3,
    "totalPrice": 15000.00,
    "totalDiscount": 1500.00,
    "totalSavings": 1500.00,
    "isEmpty": false
  }
}
```

---

### 6. ORDER CONTROLLER (`/api/orders`)
**Base URL:** `http://localhost:8080/api/orders`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create new order |
| GET | `/user/{userId}` | Get user orders |
| GET | `/{orderId}` | Get order details |
| GET | `/number/{orderNumber}` | Get order by order number |
| PUT | `/{orderId}/cancel` | Cancel order |
| PUT | `/{orderId}/status` | Update order status |
| GET | `/vendor/{vendorId}` | Get vendor orders |
| GET | `/delivery/{deliveryPartnerId}` | Get delivery partner orders |
| GET | `/stats/{userId}` | Get order statistics |
| GET | `/{orderId}/track` | Track order |
| PUT | `/{orderId}/return` | Return order |

#### Example Requests:

**Create Order:**
```bash
POST http://localhost:8080/api/orders/create
Parameters:
  - userId: 1
  - shippingAddress: 123 Main St, New York, NY 10001
  - paymentMethod: CARD
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response:
{
  "status": "success",
  "message": "Order created successfully",
  "data": { Created OrderDTO with orderNumber, totalPrice, items, etc }
}
```

**Cancel Order:**
```bash
PUT http://localhost:8080/api/orders/1/cancel
Parameters:
  - reason: Changed my mind
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response:
{
  "status": "success",
  "message": "Order cancelled",
  "data": { Updated OrderDTO with status CANCELLED }
}
```

---

### 7. VENDOR CONTROLLER (`/api/vendors`)
**Base URL:** `http://localhost:8080/api/vendors`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{vendorId}` | Get vendor profile |
| GET | `/user/{userId}` | Get vendor by user ID |
| PUT | `/{vendorId}` | Update vendor profile |
| GET | `/{vendorId}/products` | Get vendor products |
| GET | `/shop/{shopName}` | Get vendor by shop name |
| POST | `/{vendorId}/approve` | Approve vendor account |
| POST | `/{vendorId}/reject` | Reject vendor account |
| GET | `/{vendorId}/stats` | Get vendor statistics |
| GET | `/{vendorId}/commission` | Get vendor commission details |
| GET | `/{vendorId}/dashboard` | Get vendor dashboard |

#### Example Requests:

**Get Vendor Profile:**
```bash
GET http://localhost:8080/api/vendors/1
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response:
{
  "status": "success",
  "message": "Vendor profile retrieved",
  "data": { VendorDTO object }
}
```

**Update Vendor Profile:**
```bash
PUT http://localhost:8080/api/vendors/1
Parameters:
  - shopName: Elite Electronics
  - shopAddress: 456 Commerce Ave
  - shopDescription: Premium electronics store
  - contactNumber: 9876543210
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response: { Updated VendorDTO }
```

---

### 8. DELIVERY CONTROLLER (`/api/delivery`)
**Base URL:** `http://localhost:8080/api/delivery`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{partnerId}` | Get delivery partner profile |
| GET | `/user/{userId}` | Get delivery partner by user ID |
| PUT | `/{partnerId}` | Update delivery partner profile |
| GET | `/available/list` | Get available delivery partners |
| GET | `/top-rated/list` | Get top-rated delivery partners |
| PUT | `/{partnerId}/status` | Update delivery status |
| PUT | `/{partnerId}/location` | Update location |
| POST | `/{partnerId}/assign/{orderId}` | Assign order to partner |
| POST | `/{partnerId}/complete/{orderId}` | Mark delivery completed |
| GET | `/{partnerId}/orders` | Get partner's orders |
| GET | `/{partnerId}/stats` | Get delivery statistics |
| POST | `/{partnerId}/rate` | Rate delivery service |
| GET | `/{partnerId}/dashboard` | Get delivery dashboard |

#### Example Requests:

**Update Delivery Status:**
```bash
PUT http://localhost:8080/api/delivery/1/status
Parameters:
  - status: AVAILABLE
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response:
{
  "status": "success",
  "message": "Status updated",
  "data": { Updated DeliveryPartnerDTO }
}
```

**Update Location:**
```bash
PUT http://localhost:8080/api/delivery/1/location
Parameters:
  - latitude: 40.7128
  - longitude: -74.0060
Headers:
  - Authorization: Bearer {JWT_TOKEN}
  
Response: { Updated DeliveryPartnerDTO with new coordinates }
```

---

## Response Format

All endpoints return responses in the following format:

```json
{
  "status": "success|error",
  "message": "Operation description",
  "data": {
    // Response data (varies by endpoint)
  }
}
```

### Status Codes:
- **200 OK** - Successful GET/PUT request
- **201 Created** - Successful POST request that creates a resource
- **400 Bad Request** - Invalid request parameters
- **401 Unauthorized** - Missing or invalid JWT token
- **403 Forbidden** - User doesn't have permission
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Authentication

All protected endpoints (marked with Bearer {JWT_TOKEN}) require:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
```

The JWT token is obtained from:
1. POST `/api/auth/login` - For existing users
2. POST `/api/auth/signup` - For new customers
3. POST `/api/auth/signup/vendor` - For new vendors
4. POST `/api/auth/signup/delivery` - For new delivery partners

---

## Configuration

### Application Properties Configuration

**application.properties** should include:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/localkart_db
spring.datasource.username=root
spring.datasource.password=Swain@123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=LocalKart@2026SecretKeyForJWTTokenGenerationAndValidation123456789UpdatedVersionSecureKey
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:3000,http://localhost:3001

# Logging
logging.level.com.localkart=DEBUG
logging.level.org.springframework.web=INFO
```

---

## Error Handling

Controllers include comprehensive error handling:

```java
try {
    // Operation
} catch (Exception e) {
    logger.error("Error message: {}", e.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ApiResponse("error", "Failed to perform operation: " + e.getMessage(), null));
}
```

---

## Implementation Steps

1. **Copy all 8 controller files** to `src/main/java/com/localkart/controller/`
2. **Copy DTO classes** to `src/main/java/com/localkart/dto/`
3. **Copy utility classes** to `src/main/java/com/localkart/util/`
4. **Ensure services exist** in `src/main/java/com/localkart/service/`
5. **Add missing service methods** as indicated by controller calls
6. **Update application.properties** with correct database and JWT configuration
7. **Run Maven clean install:** `mvn clean install`
8. **Start Spring Boot application:** `mvn spring-boot:run`

---

## Testing Endpoints

### Using Postman:
1. Create a new Collection named "LocalKart API"
2. Add requests for each endpoint
3. In Authorization tab, select "Bearer Token" and paste JWT from login response
4. Test each endpoint systematically

### Using cURL:
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=user@example.com&password=Password123"

# Get User Profile (with token)
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Frontend Integration (React)

Update your React API client:

```javascript
// utils/api.js
const API_BASE_URL = 'http://localhost:8080/api';

export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const config = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) })
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return response.json();
};

// Usage in React components
const login = async (email, password) => {
  const response = await apiCall('/auth/login', 'POST', { email, password });
  if (response.status === 'success') {
    localStorage.setItem('authToken', response.data.token);
  }
  return response;
};
```

---

## Next Steps

1. Implement missing service methods
2. Create exception handling classes
3. Add input validation with @Valid annotations
4. Implement security configuration
5. Add integration tests
6. Deploy to production environment
