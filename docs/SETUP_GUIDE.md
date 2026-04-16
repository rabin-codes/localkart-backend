# LocalKart Frontend - Complete Setup & Usage Guide

## 📦 Project Overview

This is a complete, production-ready frontend application for LocalKart, a hyperlocal ecommerce platform. The application is built with React and Tailwind CSS, featuring three distinct user roles with full UI implementations.

## 🎯 What's Included

### ✅ Complete Features Implemented

#### 1. **User/Customer Side**
- Home page with hero section and featured products
- Product grid with category filtering and price range search
- Product detail page with ratings and reviews
- Shopping cart with quantity management
- Animated cart drawer (slide from right)
- 3-step checkout process
- Order success confirmation
- User dashboard with order history

#### 2. **Vendor Panel**
- Vendor login/signup with shop registration
- Vendor dashboard with statistics
- Add/edit/delete products
- Product inventory management
- Product list with status badges

#### 3. **Delivery Partner Interface**
- Delivery partner login/signup
- Active orders dashboard
- Order details view
- Accept/reject orders
- Update delivery status (Pending → Accepted → Picked-up → Delivered)
- Earnings tracking

#### 4. **UI/UX Components**
- Responsive Navbar with cart icon
- Sidebar for dashboards
- Modals and dialogs
- Toast notification system
- Form validation
- Tooltips
- Accordions
- Alert components
- Product cards with hover effects
- Loading skeletons

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
cd d:\LocalEkart
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The application will automatically open at `http://localhost:3000`

### Step 3: Build for Production
```bash
npm run build
```

## 🔐 Demo Accounts

Login with any of these credentials (or create your own):

**As a Customer:**
- Email: demo@user.com
- Password: password123
- Then navigate to Home or Dashboard

**As a Vendor:**
- Email: demo@vendor.com
- Password: password123
- Then manage products and inventory

**As a Delivery Partner:**
- Email: demo@delivery.com
- Password: password123
- Then accept and manage deliveries

## 📂 Project Structure

```
LocalEkart/
├── src/
│   ├── components/
│   │   ├── Button.jsx           # Reusable button with variants
│   │   ├── Input.jsx            # Form input with validation
│   │   ├── Modal.jsx            # Modal dialog component
│   │   ├── Toast.jsx            # Toast notification system
│   │   ├── Tooltip.jsx          # Position-aware tooltips
│   │   ├── Accordion.jsx        # Expandable accordion
│   │   ├── Alert.jsx            # Alert component
│   │   ├── Card.jsx             # Container card component
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── Sidebar.jsx          # Side navigation menu
│   │   ├── ProductCard.jsx      # Product showcase card
│   │   ├── CartDrawer.jsx       # Animated cart sidebar
│   │   ├── LoadingSkeleton.jsx  # Loading placeholder
│   │   └── index.js             # Component exports
│   │
│   ├── pages/
│   │   ├── HomePage.jsx              # Customer home page
│   │   ├── ProductDetailPage.jsx     # Product detail view
│   │   ├── UserDashboard.jsx         # Customer dashboard
│   │   ├── CheckoutPage.jsx          # Checkout flow
│   │   ├── VendorDashboard.jsx       # Vendor management
│   │   ├── DeliveryPartnerUI.jsx     # Delivery partner orders
│   │   ├── UserLoginPage.jsx         # Customer login
│   │   ├── VendorLoginPage.jsx       # Vendor login
│   │   ├── DeliveryLoginPage.jsx     # Delivery partner login
│   │   └── index.js                  # Page exports
│   │
│   ├── context/
│   │   ├── AuthContext.jsx    # Authentication & role management
│   │   ├── CartContext.jsx    # Shopping cart state
│   │   └── NotificationContext.jsx  # Toast notifications
│   │
│   ├── hooks/
│   │   ├── useForm.js         # Form validation hook
│   │   └── useToast.js        # Toast notification hook
│   │
│   ├── utils/
│   │   ├── mockData.js        # Mock products, vendors, orders
│   │   ├── validators.js      # Form validation functions
│   │   └── api.js             # Mock API calls
│   │
│   ├── App.jsx                # Main app with routing logic
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles with Tailwind
│
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── package.json               # Dependencies
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

## 🎮 How to Use the App

### As a Customer:

1. **Login/Signup**
   - Enter email and password
   - Create account with name, phone, and email
   - Click "Sign In" or "Sign Up"

2. **Browse Products**
   - Home page shows all featured products
   - Use category buttons to filter by type
   - Use search bar to find specific products
   - Adjust price range slider

3. **View Product Details**
   - Click on any product card
   - See full description, ratings, and reviews
   - Select quantity
   - Click "Add to Cart"

4. **Shopping Cart**
   - Click cart icon in navbar
   - View all items with prices
   - Adjust quantities or remove items
   - See total price and delivery charge

5. **Checkout**
   - Click "Proceed to Checkout"
   - Step 1: Enter delivery address
   - Step 2: Enter payment details
   - Step 3: Review and confirm order
   - See order confirmation

6. **Dashboard**
   - Click profile/dashboard link
   - View order history
   - Check order status
   - Edit profile information

### As a Vendor:

1. **Login/Signup**
   - Use vendor login page
   - Enter shop name, email, phone
   - Create vendor account

2. **Dashboard**
   - See statistics (products, stock, revenue)
   - View all your products in table format

3. **Add Products**
   - Click "Add Product" button
   - Fill in product details (name, price, stock, category)
   - Add image URL
   - Click "Add Product"

4. **Manage Products**
   - Edit product: Click edit icon, update details
   - Delete product: Click delete icon, confirm deletion
   - View stock levels with color coding

### As a Delivery Partner:

1. **Login/Signup**
   - Use delivery partner login
   - Enter name, email, phone, vehicle type
   - Create delivery account

2. **Dashboard**
   - See statistics (deliveries, active orders, earnings)
   - View list of available orders

3. **Accept Orders**
   - Click on an order card
   - View customer details and order items
   - Click "Accept Order" to take the delivery

4. **Update Status**
   - Click on accepted orders
   - Mark as "Picked Up"
   - Mark as "Delivered"
   - See status changes in real-time

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet optimizations
- Desktop layouts
- All components are fully responsive

### Animations
- Cart drawer slide animation
- Smooth transitions on hover
- Toast notifications with fade-in
- Modal fade and scale animations
- Loading skeleton animations

### Color Scheme
- **Primary**: Orange (#f97316) - Brand color
- **Secondary**: Dark Gray (#1f2937) - Text color
- **Background**: White/Light Gray - Clean interface
- **Status Colors**: Green (success), Red (error), Blue (info), Yellow (warning)

## 🔄 Navigation Flow

```
Start App
    ↓
Login Page (choose role: User/Vendor/Delivery)
    ↓
    User: → Home Page → Product Detail → Cart → Checkout → Success
           ↓
           Dashboard (view orders)
    ↓
    Vendor: → Dashboard (manage products) → Add/Edit/Delete
    ↓
    Delivery: → Order Dashboard → Accept Order → Update Status
```

## 📊 Data Management

### Context API State
- **Auth**: User data, role, login status
- **Cart**: Products, quantities, total price
- **Notifications**: Toast messages queue

### Mock Data
- 8 sample products with images
- 2 sample vendors
- 3 sample delivery orders
- 5 product categories
- 5 FAQ items

### Local Storage
- User data (for persistence - optional)
- User role

## 🛠️ Component Usage Examples

### Button Component
```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>

{/* Variants: primary, secondary, danger, outline, ghost */}
{/* Sizes: sm, md, lg */}
```

### Input Component
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  placeholder="Enter email"
  required
/>
```

### Modal Component
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  footer={<Button onClick={handleConfirm}>Confirm</Button>}
>
  Modal content here
</Modal>
```

### Toast Notification
```jsx
const { showToast } = useNotification();

showToast('Item added to cart!', 'success');
showToast('An error occurred', 'error');
showToast('Warning message', 'warning');
showToast('Info message', 'info');
```

### Cart Management
```jsx
const { cart, addToCart, removeFromCart, getTotalPrice } = useCart();

// Add product to cart
addToCart(productObject);

// Remove product
removeFromCart(productId);

// Get total
const total = getTotalPrice();
```

## 🎯 Customization Guide

### Change Colors
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
}
```

### Add New Components
1. Create file in `src/components/`
2. Build your component
3. Export in `src/components/index.js`

### Add New Pages
1. Create file in `src/pages/`
2. Import and add navigation in `App.jsx`
3. Export in `src/pages/index.js`

### Modify Mock Data
Edit `src/utils/mockData.js` to update:
- Products
- Vendors
- Delivery orders
- Categories
- FAQ items

## 🚀 Deployment

### Build the Project
```bash
npm run build
```

### Deploy Options
- **Vercel**: `npm install -g vercel` → `vercel`
- **Netlify**: `npm run build` → drag dist folder
- **GitHub Pages**: Configure in package.json
- **Traditional Server**: Copy `dist` folder to web server

## 🔧 Environment Setup

### Required
- Node.js v16+
- npm or yarn

### Optional
- VS Code (recommended editor)
- ES7+ JavaScript knowledge
- React hooks understanding
- Tailwind CSS basics

## 📝 Best Practices Implemented

✅ Functional components only (no class components)
✅ React Hooks (useState, useContext, useCallback)
✅ Custom hooks for reusable logic
✅ Context API for global state
✅ Prop drilling minimized
✅ Component composition
✅ DRY (Don't Repeat Yourself)
✅ Semantic HTML
✅ Accessibility considerations
✅ Mobile-first responsive design
✅ Error handling
✅ Form validation
✅ Loading states

## ⚠️ Important Notes

1. **No Backend**: This is frontend only. To use with a real backend:
   - Replace mock API calls in `src/utils/api.js`
   - Update context providers with actual data
   - Implement real authentication

2. **No Database**: All data is mock. For persistence:
   - Add backend database
   - Implement user registration/authentication
   - Store products and orders server-side

3. **No Payments**: Checkout is mock only. To add payments:
   - Integrate Razorpay or Stripe
   - Handle payment API calls
   - Store payment information securely

4. **No Email**: No email notifications implemented

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Tailwind CSS Not Working
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

### Components Not Importing
- Check spelling in import statements
- Verify files exist in correct directories
- Ensure exports are correct in index.js files

## 🎓 Learning Tips

1. **Understand the Flow**: Trace through `App.jsx` to understand page navigation
2. **Study Components**: Each component is self-contained and well-commented
3. **Check Mock Data**: `mockData.js` shows data structure
4. **Review Hooks**: Custom hooks in `src/hooks/` are simple and well-structured
5. **Practice Modifications**: Try adding features or changing styling

## 📞 Support & Resources

- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Vite Docs**: https://vitejs.dev
- **Lucide Icons**: https://lucide.dev

## 🎉 You're Ready!

You now have a complete, professional-grade ecommerce frontend. Start the dev server and explore all the features!

```bash
npm run dev
```

Happy coding! 🚀
