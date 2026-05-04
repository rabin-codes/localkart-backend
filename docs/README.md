<<<<<<< HEAD
# LocalKart Backend - E-Commerce Platform

A complete Spring Boot backend for the LocalKart e-commerce platform with JWT authentication, role-based access control, and comprehensive API endpoints for managing products, orders, users, vendors, and delivery partners.

## Project Overview

LocalKart is a multi-vendor e-commerce platform built with:
- **Backend**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Authentication**: JWT (JJWT 0.12.3)
- **API Style**: RESTful with pagination support
- **Frontend**: React (separate repository)

## Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.8.0 or higher
- MySQL 8.0 or higher
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/localkart-backend.git
cd localkart-backend
```

2. **Create MySQL Database**
```sql
CREATE DATABASE IF NOT EXISTS localkart_db;
USE localkart_db;
```

3. **Update Database Configuration**

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/localkart_db
spring.datasource.username=root
spring.datasource.password=CHANGE_ME_IN_PRODUCTION
```

4. **Build and Run**

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run from IDE
# Right-click LocalkartApplication.java → Run As → Java Application
```

5. **Verify Backend is Running**

```bash
curl http://localhost:8080/api/products
```

The API will be available at: **http://localhost:8080/api**

## Project Structure

```
src/main/java/com/localkart/
├── LocalkartApplication.java              # Main entry point
│
├── config/
│   ├── SecurityConfig.java                # Spring Security + JWT setup
│   ├── CorsConfig.java                    # CORS configuration
│   └── JwtConfig.java                     # JWT configuration properties
│
├── controller/
│   ├── AuthController.java                # Auth endpoints (login, signup)
│   ├── UserController.java                # User profile endpoints
│   ├── ProductController.java             # Product management
│   ├── CategoryController.java            # Category management
│   ├── CartController.java                # Shopping cart operations
│   ├── OrderController.java               # Order management
│   ├── VendorController.java              # Vendor operations
│   └── DeliveryController.java            # Delivery partner operations
│
├── service/
│   ├── AuthService.java                   # Authentication logic
│   ├── UserService.java                   # User management
│   ├── ProductService.java                # Product operations
│   ├── CartService.java                   # Cart logic
│   ├── OrderService.java                  # Order processing
│   ├── VendorService.java                 # Vendor management
│   ├── DeliveryService.java               # Delivery operations
│   └── JwtService.java                    # JWT token handling
│
├── entity/
│   ├── User.java                          # User entity
│   ├── Product.java                       # Product entity
│   ├── Category.java                      # Category entity
│   ├── Cart.java & CartItem.java          # Shopping cart entities
│   ├── Order.java & OrderItem.java        # Order entities
│   ├── Vendor.java                        # Vendor entity
│   ├── DeliveryPartner.java               # Delivery partner entity
│   └── Review.java                        # Review entity
│
├── repository/
│   ├── UserRepository.java                # User JPA repository
│   ├── ProductRepository.java             # Product JPA repository
│   ├── CategoryRepository.java            # Category JPA repository
│   ├── CartRepository.java                # Cart JPA repository
│   ├── CartItemRepository.java            # CartItem JPA repository
│   ├── OrderRepository.java               # Order JPA repository
│   ├── OrderItemRepository.java           # OrderItem JPA repository
│   ├── VendorRepository.java              # Vendor JPA repository
│   ├── DeliveryRepository.java            # Delivery partner JPA repository
│   └── ReviewRepository.java              # Review JPA repository
│
├── dto/
│   ├── AuthRequest.java                   # Login request DTO
│   ├── AuthResponse.java                  # Login response DTO
│   ├── UserDTO.java                       # User data transfer object
│   ├── ProductDTO.java                    # Product DTO
│   ├── CartDTO.java                       # Cart DTO
│   ├── OrderDTO.java                      # Order DTO
│   └── ReviewDTO.java                     # Review DTO
│
├── security/
│   ├── JwtTokenProvider.java              # JWT token generation & validation
│   ├── JwtAuthenticationFilter.java       # JWT filter for request interception
│   └── CustomUserDetails.java             # Custom user details implementation
│
├── exception/
│   ├── GlobalExceptionHandler.java        # Centralized exception handling
│   ├── ResourceNotFoundException.java     # 404 exception
│   └── UnauthorizedException.java         # 401 exception
│
└── util/
    ├── ApiResponse.java                   # Generic API response wrapper
    ├── ResponseBuilder.java               # Response building utility
    └── Constants.java                     # Application constants

src/main/resources/
├── application.properties                 # Main configuration
├── application-dev.properties             # Development profile
├── application-prod.properties            # Production profile
└── data.sql                               # Sample data (optional)
```

## API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Customer login |
| POST | `/auth/signup` | Customer registration |
| POST | `/auth/signup/vendor` | Vendor registration |
| POST | `/auth/signup/delivery` | Delivery partner registration |
| POST | `/auth/validate-token` | Validate JWT token |
| POST | `/auth/change-password` | Change password |
| POST | `/auth/logout` | Logout user |

### User Endpoints (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/{userId}` | Get user profile |
| PUT | `/users/{userId}` | Update user profile |
| GET | `/users/{userId}/profile-completion` | Get profile completion % |
| POST | `/users/{userId}/deactivate` | Deactivate account |
| GET | `/users/stats/{userId}` | Get user statistics |

### Product Endpoints (`/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products (paginated) |
| GET | `/products/{productId}` | Get product by ID |
| GET | `/products/category/{categoryId}` | Get products by category |
| GET | `/products/search` | Search products |
| POST | `/products` | Add new product (vendor only) |
| PUT | `/products/{productId}` | Update product (vendor only) |
| DELETE | `/products/{productId}` | Delete product (vendor only) |

### Cart Endpoints (`/cart`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart/{userId}` | Get user cart |
| POST | `/cart/{userId}/add/{productId}` | Add item to cart |
| PUT | `/cart/{userId}/update/{cartItemId}` | Update item quantity |
| DELETE | `/cart/{userId}/remove/{cartItemId}` | Remove item from cart |
| DELETE | `/cart/{userId}/clear` | Clear entire cart |
| GET | `/cart/{userId}/summary` | Get cart summary |

### Order Endpoints (`/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders/create` | Create new order |
| GET | `/orders/user/{userId}` | Get user orders |
| GET | `/orders/{orderId}` | Get order details |
| PUT | `/orders/{orderId}/cancel` | Cancel order |
| PUT | `/orders/{orderId}/status` | Update order status |
| GET | `/orders/{orderId}/track` | Track order |

### Other Endpoints
- **Categories**: GET `/categories`, POST `/categories`, PUT `/categories/{id}`, DELETE `/categories/{id}`
- **Vendors**: GET `/vendors/{vendorId}`, PUT `/vendors/{vendorId}`, GET `/vendors/{vendorId}/products`
- **Delivery**: GET `/delivery/{partnerId}`, PUT `/delivery/{partnerId}/status`, POST `/delivery/{partnerId}/assign/{orderId}`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer {jwt_token}
```

### Get JWT Token

1. **Register/Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=user@example.com&password=Password123"
```

2. **Response** includes JWT token:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "role": "CUSTOMER"
  }
}
```

3. **Use token in requests**:
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
```

## User Roles

- **CUSTOMER**: Regular customer
- **VENDOR**: Seller/Vendor
- **DELIVERY**: Delivery partner
- **ADMIN**: Administrator

## Configuration

### application.properties

Key configuration options:

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/localkart_db
spring.datasource.username=root
spring.datasource.password=CHANGE_ME_IN_PRODUCTION

# JWT
jwt.secret=GENERATE_A_STRONG_RANDOM_KEY
jwt.expiration=86400000

# Logging
logging.level.com.localkart=DEBUG
logging.file.name=logs/localkart.log
```

### Profiles

- **dev**: `spring.profiles.active=dev` (default - auto-create schema)
- **prod**: `spring.profiles.active=prod` (validate schema only)

## Database Schema

The application automatically creates the database schema on startup. Key tables:

- **users**: User accounts
- **products**: Product catalog
- **categories**: Product categories
- **cart** & **cart_items**: Shopping cart
- **orders** & **order_items**: Order management
- **vendors**: Vendor profiles
- **delivery_partners**: Delivery personnel
- **reviews**: Product reviews
- **wishlist**: User wishlists

## Development

### Build
```bash
mvn clean install
```

### Run Tests
```bash
mvn test
```

### Run with Specific Profile
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

### Generate JAR
```bash
mvn clean package
java -jar target/localkart-backend-1.0.0.jar
```

## Troubleshooting

### Database Connection Error
- Verify MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `application.properties`

### JWT Token Errors
- Ensure token is included in Authorization header
- Token expires after 24 hours
- Check header format: `Bearer {token}`

### CORS Errors
- Frontend must be on localhost:3000 or 3001
- Check `CorsConfig.java` for allowed origins

### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :8080   # Windows
taskkill /PID <PID> /F         # Windows
```

## Testing with Postman

1. **Import Collection**: Use the provided `Postman_Collection.json`
2. **Set Variables**: 
   - `base_url`: http://localhost:8080/api
   - `token`: (set after login)
3. **Test Endpoints**: Run requests in collection

## Frontend Integration

The React frontend connects to this backend:

```javascript
// React API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Include JWT token in requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

Frontend repository: https://github.com/yourusername/localkart-frontend

## Security Features

✅ JWT-based authentication
✅ Role-based access control (RBAC)
✅ Spring Security integration
✅ Bcrypt password encoding
✅ CORS configuration
✅ Input validation
✅ Exception handling
✅ Comprehensive logging

## Performance Optimization

- Connection pooling (HikariCP)
- Pagination on list endpoints
- Database query optimization
- Lazy loading for relationships
- Caching strategies
- Batch processing

## Deployment

### Docker (Optional)

```dockerfile
FROM openjdk:17-slim
COPY target/localkart-backend-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### AWS/Cloud Deployment

1. Create RDS MySQL instance
2. Update `application-prod.properties` with RDS endpoint
3. Deploy JAR to EC2/ECS/Lambda
4. Configure environment variables:
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support & Documentation

- **API Docs**: `CONTROLLERS_DOCUMENTATION.md`
- **Setup Guide**: `INTEGRATION_GUIDE.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`

## Contact

For issues, questions, or contributions, please contact the development team.

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
=======
# LocalKart - Hyperlocal Ecommerce Platform Frontend

A modern, production-level frontend UI for a hyperlocal ecommerce platform built with React and Tailwind CSS.

## 🌟 Features

### User Side
- ✅ Beautiful home page with product grid
- ✅ Advanced search and filtering (category, price range)
- ✅ Product detail pages with rich information
- ✅ Smart cart management with quantity controls
- ✅ Animated cart drawer (slide from right)
- ✅ Complete checkout flow (3-step process)
- ✅ Order confirmation with toast notifications
- ✅ User dashboard with order history

### Vendor Panel
- ✅ Vendor login/signup
- ✅ Dashboard with statistics
- ✅ Product management (add, edit, delete)
- ✅ Inventory tracking
- ✅ Product listing with status badges

### Delivery Partner
- ✅ Delivery login/signup
- ✅ Active orders dashboard
- ✅ Order details view
- ✅ Accept/reject orders
- ✅ Update delivery status
- ✅ Earnings tracking

### UI/UX Features
- ✅ Fully responsive design (mobile + tablet + desktop)
- ✅ Smooth animations and transitions
- ✅ Toast notifications system
- ✅ Modal dialogs
- ✅ Loading skeletons
- ✅ Form validation
- ✅ Tooltips
- ✅ Accordion components
- ✅ Alert system

## 🛠️ Tech Stack

- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide Icons** - Icon library
- **Context API** - State management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── Toast.jsx
│   ├── Tooltip.jsx
│   ├── Accordion.jsx
│   ├── Alert.jsx
│   ├── Card.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ProductCard.jsx
│   ├── CartDrawer.jsx
│   ├── LoadingSkeleton.jsx
│   └── index.js
├── pages/               # Page components
│   ├── HomePage.jsx
│   ├── ProductDetailPage.jsx
│   ├── UserDashboard.jsx
│   ├── CheckoutPage.jsx
│   ├── VendorDashboard.jsx
│   ├── DeliveryPartnerUI.jsx
│   ├── UserLoginPage.jsx
│   ├── VendorLoginPage.jsx
│   ├── DeliveryLoginPage.jsx
│   └── index.js
├── context/             # Context providers
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── NotificationContext.jsx
├── hooks/               # Custom hooks
│   ├── useForm.js
│   └── useToast.js
├── utils/               # Utility functions
│   ├── mockData.js      # Mock data for testing
│   ├── validators.js    # Form validators
│   └── api.js           # Mock API calls
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LocalEkart
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Color Theme

- **Primary Color**: Orange (#f97316)
- **Secondary Color**: Dark Gray (#1f2937)
- **Background**: White / Light Gray

## 🔐 Authentication Roles

The platform supports three different user roles:

1. **User/Customer**
   - Browse products
   - Add to cart
   - Place orders
   - View order history

2. **Vendor**
   - Manage products
   - Track inventory
   - View sales

3. **Delivery Partner**
   - Accept orders
   - Track deliveries
   - Update delivery status

## 💾 State Management

The application uses React Context API for state management:

- **AuthContext** - User authentication and role management
- **CartContext** - Shopping cart management
- **NotificationContext** - Toast notifications

## 🎯 Mock Data

All data is mocked using JSON objects. The following mock data is available:

- `mockProducts` - 8 sample products with details
- `mockVendors` - Sample vendor data
- `mockDeliveryOrders` - Sample delivery orders
- `categories` - Product categories
- `faqItems` - FAQ items for home page

## 🧩 Reusable Components

All UI components are highly reusable and composable:

- **Button** - Multiple variants (primary, secondary, danger, outline, ghost)
- **Input** - With label, validation error, disabled state
- **Modal** - Customizable dialog component
- **Card** - Container component with optional hover effects
- **Toast** - Notification system with multiple types
- **Tooltip** - Position-aware tooltips
- **Accordion** - Collapsible items
- **Alert** - Info/warning/error/success alerts
- **Navbar** - Navigation bar with cart icon
- **Sidebar** - Navigation sidebar for dashboards
- **ProductCard** - Product showcase card
- **LoadingSkeleton** - Skeleton loading state

## 🔄 Navigation Flow

```
Login (User/Vendor/Delivery) 
  ↓
Home (User) / Dashboard (Vendor/Delivery)
  ↓
  User: Product Detail → Cart → Checkout → Order Success
  Vendor: Product Management
  Delivery: Order Management
```

## 📝 Form Validation

Basic validation is included for:
- Email validation
- Password length check
- Phone number format
- Required field checks

## 🎪 Advanced Features

- **Animated Transitions** - Smooth page transitions and hover effects
- **Responsive Images** - Lazy loading placeholder images from Unsplash
- **Form State Management** - `useForm` hook for complex forms
- **Toast Notifications** - Contextual notifications with auto-dismiss
- **Loading States** - Skeleton screens for loading
- **Error Handling** - Form validation and error messages
- **Search & Filter** - Real-time product search and filtering

## 💡 Demo Users

You can login with any email/password combination (validation is basic):

**User Account:**
- Email: demo@user.com
- Password: password123

**Vendor Account:**
- Email: demo@vendor.com
- Password: password123

**Delivery Account:**
- Email: demo@delivery.com
- Password: password123

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Feel free to fork, modify, and use this project as a base for your own ecommerce platform.

## 📄 License

MIT License - feel free to use this project commercially or personally.

## 🎓 Learning Resources

This project demonstrates:
- React functional components and hooks
- Context API for state management
- Tailwind CSS for responsive design
- Component composition patterns
- Form handling and validation
- Modal and drawer animations
- Toast notification system
- Role-based interfaces

## 🐛 Known Limitations

- Data is not persisted (use local storage or backend API for persistence)
- Mock API calls use setTimeout (implement real API integration)
- No real payment processing (integrate Razorpay, Stripe, etc.)
- No real authentication (integrate JWT or OAuth)

## 🚀 Future Enhancements

- [ ] Real backend API integration
- [ ] Real payment gateway integration
- [ ] Real-time order tracking with maps
- [ ] Push notifications
- [ ] Ratings and reviews system
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Analytics dashboard for vendors
- [ ] Advanced filtering and sorting
- [ ] Wishlist functionality

## 📧 Support

For questions or support, please refer to the code comments or create an issue.

---

**Happy Coding! 🎉**

Built with ❤️ for LocalKart
>>>>>>> ed03fa0 (Updated backend code)
