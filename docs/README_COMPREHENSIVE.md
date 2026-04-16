# LocalKart - Hyperlocal eCommerce Platform

**A modern, responsive, startup-level ecommerce frontend for buying fresh products from local vendors**

## 🎯 Overview

LocalKart is a hyperlocal ecommerce platform frontend built with React, bringing fresh groceries and local products to customers' doorsteps in 30-45 minutes. The platform supports three user roles: customers, vendors, and delivery partners.

## ✨ Features

### For Customers
- 🏪 Browse 40+ fresh products across multiple categories
- 🛒 Add to cart and manage orders
- 💳 Secure checkout with multiple payment methods
- 🚚 Real-time delivery tracking
- ⭐ Product ratings and reviews
- ❤️ Wishlist functionality
- 📱 Responsive mobile-first design

### For Vendors
- 📊 Dashboard with sales analytics
- 📦 Product inventory management
- 💹 Revenue tracking and statistics
- ⭐ Vendor ratings management
- 📈 Monthly sales performance

### For Delivery Partners
- 📋 Incoming delivery requests
- 🗺️ Real-time order tracking
- 💰 Earnings tracker
- ✅ Accept/Reject orders
- 📍 Route optimization

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Clone the repository
cd LocalEkart

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:5173/` by default with Vite's fast HMR.

## 📁 Project Structure

```
LocalEkart/
├── src/
│   ├── components/          # Reusable UI components (31 total)
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── Toast.jsx
│   │   ├── Badge.jsx
│   │   ├── RatingComponent.jsx
│   │   ├── StatCard.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── ImageCarousel.jsx
│   │   ├── AnimatedCounter.jsx
│   │   ├── TestimonialCard.jsx
│   │   ├── ProductGallery.jsx
│   │   ├── PaymentMethodSelector.jsx
│   │   ├── RazorpayPaymentGateway.jsx
│   │   ├── NewsletterSignup.jsx
│   │   ├── DeliveryRequestCard.jsx
│   │   ├── PopupModal.jsx
│   │   ├── Hero.jsx
│   │   ├── SectionDivider.jsx
│   │   └── more...
│   │
│   ├── pages/              # Page components
│   │   ├── LandingPage.jsx        # Home page with hero & features
│   │   ├── HomePage.jsx           # Customer product listing
│   │   ├── ProductDetailPage.jsx  # Product details with gallery
│   │   ├── CheckoutPage.jsx       # 3-step checkout
│   │   ├── UserDashboard.jsx      # Customer profile & orders
│   │   ├── VendorDashboard.jsx    # Vendor analytics
│   │   ├── DeliveryPartnerUI.jsx  # Delivery partner dashboard
│   │   ├── UserLoginPage.jsx
│   │   ├── VendorLoginPage.jsx
│   │   └── DeliveryLoginPage.jsx
│   │
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useForm.js
│   │   └── useNotification.js
│   │
│   ├── utils/              # Utility functions
│   │   ├── mockData.js
│   │   └── mockDataExtended.js (42+ products)
│   │
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind styles
│
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── README.md              # This file
```

## 🎨 Component Library (31 Components)

### Original Components
- **Button** - Variants: primary, secondary, danger, outline, ghost | Sizes: sm, md, lg
- **Card** - Container with padding and shadow
- **Input** - Form input with label, error, required field
- **Modal** - Dialog box with customizable footer
- **Toast** - Notification with auto-dismiss
- **Tooltip** - Position-aware tooltip (top, bottom, left, right)
- **Accordion** - Expandable content sections
- **Alert** - Info/warning/error/success alerts
- **Navbar** - Sticky navigation with cart badge
- **Sidebar** - Responsive sidebar menu
- **ProductCard** - Product display with add to cart
- **CartDrawer** - Animated cart panel from right
- **LoadingSkeleton** - Pulse animation loader

### New Advanced Components (18)
- **ImageCarousel** - Auto-play image gallery with dots and nav buttons
- **AnimatedCounter** - Animated number counter for statistics
- **TestimonialCard** - Customer testimonial with rating
- **RatingComponent** - 5-star rating display
- **Badge** - Multi-variant badge (6 colors, 3 sizes)
- **StatCard** - Statistics with trend indicators
- **FeatureCard** - Feature showcase with gradient
- **FormSection** - Reusable form section wrapper
- **DeliveryRequestCard** - Delivery order request with animations
- **PopupModal** - Enhanced modal with backdrop blur
- **Hero** - Full-screen hero section with animations
- **SectionDivider** - Section header/divider
- **ProductGallery** - Complete product detail gallery
- **NewsletterSignup** - Email subscription form
- **PaymentMethodSelector** - Payment method selection UI
- **RazorpayPaymentGateway** - Mock payment gateway integration

## 🎯 Pages Overview

### LandingPage (Public)
- Hero section with animated background
- Featured products with category filter
- Benefits section (6 features)
- How it works (4-step process)
- Statistics with animated counters
- Customer testimonials
- Newsletter signup
- Footer with links

### HomePage (Customer)
- Product listing grid
- Search and filter
- Add to cart
- View saved items

### ProductDetailPage (Customer)
- Image carousel gallery
- Quantity selector
- Add to cart button
- Tabbed interface (Details, Reviews, Shipping)
- Related products
- Star rating display

### CheckoutPage (Customer)
- 3-step process: Delivery Address → Payment → Confirmation
- Address form with validation
- Order summary sidebar
- Built-in payment gateway

### UserDashboard (Customer)
- Profile information
- Order history
- Saved addresses
- Payment methods

### VendorDashboard (Vendor)
- Product inventory management
- Sales analytics
- Revenue tracking
- Order management

### DeliveryPartnerUI (Delivery)
- Incoming delivery requests
- Order acceptance/rejection
- Earnings tracker
- Real-time notifications

## 🎨 Design System

### Colors
- **Primary**: Orange (#f97316)
- **Secondary**: Dark Gray (#1f2937)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#fbbf24)
- **Danger**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

### Typography
- **Headings**: Bold, dark gray (#1f2937)
- **Body Text**: Regular, gray (#6b7280)
- **Labels**: Semibold, small font

### Spacing
- Base unit: 4px (Tailwind convention)
- Standard padding: 4, 6, 8, 12, 16px
- Standard margins: 4, 6, 8, 12, 16px

### Animations
- **fadeIn** - Opacity transition
- **slideIn/slideOut** - Horizontal sliding
- **bounce** - Bouncing effect
- **pulse** - Pulsing attention effect

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.0",
  "lucide-react": "^0.263.1",
  "tailwindcss": "^3.3.0",
  "vite": "^4.4.0"
}
```

## 🔐 State Management

### AuthContext
- User authentication state
- User role management
- Login/logout actions

### CartContext
- Cart item management
- Add/remove items
- Calculate totals
- Clear cart

### NotificationContext
- Toast notifications
- Success/warning/error/info types
- Auto-dismiss functionality

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory, optimized and ready for deployment.

## 📱 Responsive Design

- **Mobile**: 320px and up
- **Tablet**: 768px and up (md breakpoint)
- **Desktop**: 1024px and up (lg breakpoint)
- **Large Desktop**: 1280px and up (xl breakpoint)

All components are tested and optimized for mobile-first approach.

## ⌨️ Keyboard Navigation

- Tab: Navigate through interactive elements
- Enter: Activate buttons or submit forms
- Escape: Close modals and dropdowns
- Arrow keys: Navigate through menus

## 🎯 Routes

### Public Routes
- `GET /` - Landing page

### Authentication Routes
- `GET /user-login` - Customer login
- `GET /vendor-login` - Vendor login
- `GET /delivery-login` - Delivery partner login

### Protected Customer Routes (Requires user role)
- `GET /home` - Customer home page
- `GET /product/:id` - Product details
- `GET /dashboard` - Customer dashboard
- `GET /checkout` - Checkout page

### Protected Vendor Routes (Requires vendor role)
- `GET /vendor-dashboard` - Vendor dashboard

### Protected Delivery Routes (Requires delivery role)
- `GET /delivery-dashboard` - Delivery dashboard

## 📊 Mock Data

The app includes comprehensive mock data:

### Products (42 items)
**Categories**: Vegetables (10), Bakery (8), Dairy (8), Beverages (8), Snacks (8)

Each product includes:
- Name, price, original price (discount)
- Images (main + gallery array)
- Vendor info with verification badge
- Star rating (4.3-4.9)
- Review count (50-400+)
- Stock availability

### Testimonials (4 entries)
- Customer name, role, photo
- 5-star ratings
- Customer quotes

### Statistics
- Active users: 50K+
- Daily orders: 5K+
- Partner vendors: 500+
- Cities covered: 25+

## 🔧 Configuration

### Vite Config
- React Fast Refresh HMR
- Port: 5173
- Optimized build with minification

### Tailwind Config
- Custom primary/secondary colors
- Custom animations (fadeIn, slideIn, bounce, pulse)
- Extended color palette
- Responsive design utilities

## 📝 Code Guidelines

### Naming Conventions
- Components: PascalCase (e.g., `ProductCard.jsx`)
- Functions: camelCase (e.g., `handleAddToCart`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`)

### File Structure
- Each component in its own file
- One default export per component file
- Index files for barrel exports
- Organized imports at top of files

### CSS Styling
- Tailwind CSS utility classes
- Inline styles only when necessary
- Custom CSS in separate files if needed

## 🐛 Troubleshooting

### App not starting?
```bash
npm install
npm run dev
```

### Port 5173 already in use?
```bash
npx vite --port 3000
```

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🚀 Performance

- **Code Splitting**: Automatic with Vite
- **Lazy Loading**: React Router lazy components
- **Image Optimization**: Unsplash CDN for images
- **CSS**: Tailwind PurgeCSS removes unused styles
- **Bundle Size**: Optimized for fast loading

## 📄 License

This project is part of the LocalKart ecommerce platform.

## 👥 Contributing

1. Create a new branch for features
2. Follow code guidelines
3. Test on multiple devices
4. Submit pull request with description

## 📞 Support

For issues and questions, please refer to the project documentation or contact the development team.

---

**Version**: 2.0.0  
**Status**: Production Ready  
**Last Updated**: 2024  
**Total Components**: 31  
**Total Pages**: 10  
**Code Quality**: Enterprise Grade  
**Mobile Friendly**: 100%
