# Component Reference Guide

## 🎨 UI Components Library

### 1. Button Component
**Location**: `src/components/Button.jsx`

```jsx
import { Button } from './components';

// Basic usage
<Button onClick={handleClick}>Click Me</Button>

// All props
<Button
  children="Text"
  onClick={function}
  className="additional classes"
  disabled={false}
  variant="primary" // primary, secondary, danger, outline, ghost
  size="md"         // sm, md, lg
/>
```

**Variants:**
- `primary` - Orange background (default)
- `secondary` - Gray background
- `danger` - Red background for destructive actions
- `outline` - Bordered style
- `ghost` - Transparent with text color only

---

### 2. Input Component
**Location**: `src/components/Input.jsx`

```jsx
import { Input } from './components';

<Input
  type="text"          // text, email, password, number, tel
  placeholder="Enter"
  value={value}
  onChange={handleChange}
  className=""
  label="Field Label"
  error="Error message"
  required={true}
  disabled={false}
/>
```

**Features:**
- Built-in label
- Error state with message
- Required field indicator
- Disabled state
- Tailwind styling

---

### 3. Modal Component
**Location**: `src/components/Modal.jsx`

```jsx
import { Modal } from './components';

<Modal
  isOpen={true}
  onClose={handleClose}
  title="Modal Title"
  size="md" // sm, md, lg, xl
  footer={<Button onClick={handleConfirm}>Confirm</Button>}
>
  Modal content here
</Modal>
```

**Features:**
- Animated fade-in
- Close button (X)
- Customizable footer
- Responsive sizes
- Overlay click to close

---

### 4. Toast Container & Notifications
**Location**: `src/components/Toast.jsx`

```jsx
import { useNotification } from './context/NotificationContext';

const { showToast } = useNotification();

// Usage
showToast('Success message', 'success'); // auto-dismiss in 3 seconds
showToast('Error message', 'error', 5000); // 5 second duration
showToast('Warning', 'warning');
showToast('Info', 'info');

// Add to bottom of app
<ToastContainer />
```

**Types:** success, error, warning, info

---

### 5. Tooltip Component
**Location**: `src/components/Tooltip.jsx`

```jsx
import { Tooltip } from './components';

<Tooltip text="Helpful text" position="top">
  <button>Hover Me</button>
</Tooltip>

// Positions: top, bottom, left, right
```

---

### 6. Accordion Component
**Location**: `src/components/Accordion.jsx`

```jsx
import { Accordion } from './components';

const items = [
  {
    id: 1,
    title: "Question 1",
    content: "Answer here"
  },
  {
    id: 2,
    title: "Question 2",
    content: "Answer here"
  }
];

<Accordion items={items} />
```

---

### 7. Alert Component
**Location**: `src/components/Alert.jsx`

```jsx
import { Alert } from './components';

<Alert
  type="success" // success, error, warning, info
  title="Alert Title"
  message="Alert message"
  onClose={() => setDismissed(true)}
/>
```

---

### 8. Card Component
**Location**: `src/components/Card.jsx`

```jsx
import { Card } from './components';

<Card className="additional" hoverable={true}>
  Card content here
</Card>
```

**Features:**
- Optional hover shadow effect
- Responsive padding
- Clean spacing

---

### 9. Navbar Component
**Location**: `src/components/Navbar.jsx`

```jsx
import { Navbar } from './components';

<Navbar
  onLogoClick={handleLogoClick}
  onMenuToggle={setMenuOpen}
  menuOpen={menuOpen}
/>
```

**Features:**
- Logo click handler
- Cart icon with count badge
- User greeting
- Logout button
- Mobile menu toggle
- Sticky positioning

---

### 10. Sidebar Component
**Location**: `src/components/Sidebar.jsx`

```jsx
import { Sidebar } from './components';

const items = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  { id: 'products', label: 'Products', icon: <ProductIcon /> },
];

<Sidebar
  isOpen={sidebarOpen}
  onClose={closeSidebar}
  items={items}
  activeItem={activeItem}
  onItemClick={handleItemClick}
/>
```

---

### 11. ProductCard Component
**Location**: `src/components/ProductCard.jsx`

```jsx
import { ProductCard } from './components';

const product = {
  id: 1,
  name: "Product Name",
  price: 45,
  originalPrice: 60,
  image: "url",
  vendor: "Vendor Name"
};

<ProductCard
  product={product}
  onViewDetail={handleViewDetail}
/>
```

---

### 12. CartDrawer Component
**Location**: `src/components/CartDrawer.jsx`

```jsx
import { CartDrawer } from './components';

<CartDrawer />

// Uses CartContext automatically
// Renders a slide-out drawer from right
```

**Features:**
- Animated slide-in/out
- Cart items display
- Quantity controls
- Remove items button
- Total price calculation
- Checkout button

---

### 13. LoadingSkeleton Component
**Location**: `src/components/LoadingSkeleton.jsx`

```jsx
import { LoadingSkeleton } from './components';

{isLoading ? <LoadingSkeleton /> : <Content />}
```

---

## 🎯 Context Providers

### AuthContext
**Location**: `src/context/AuthContext.jsx`

```jsx
import { useAuth } from './context/AuthContext';

const { 
  user,              // User object
  userRole,          // 'user', 'vendor', 'delivery'
  isAuthenticated,   // Boolean
  login,             // Function
  logout             // Function
} = useAuth();

// Login example
login({ name: 'John', email: 'john@example.com' }, 'user');

// Logout
logout();
```

---

### CartContext
**Location**: `src/context/CartContext.jsx`

```jsx
import { useCart } from './context/CartContext';

const {
  cart,                // Array of items
  showCart,            // Boolean
  setShowCart,         // Function
  addToCart,           // Function
  removeFromCart,      // Function
  updateQuantity,      // Function
  clearCart,           // Function
  getTotalPrice,       // Function
  getCartCount         // Function
} = useCart();

// Usage
addToCart(product);
removeFromCart(productId);
updateQuantity(productId, 5);
const total = getTotalPrice();
const count = getCartCount();
```

---

### NotificationContext
**Location**: `src/context/NotificationContext.jsx`

```jsx
import { useNotification } from './context/NotificationContext';

const {
  notifications,      // Array
  showToast,         // Function
  removeNotification // Function
} = useNotification();

// Usage
showToast('Message', 'success', 3000); // duration in ms
showToast('Error', 'error');
```

---

## 🎪 Custom Hooks

### useForm Hook
**Location**: `src/hooks/useForm.js`

```jsx
import { useForm } from './hooks/useForm';

const { 
  values,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
  setFieldError,
  resetForm,
  setValues
} = useForm(
  { email: '', password: '' },
  async (values) => {
    await submitForm(values);
  }
);

// In form
<form onSubmit={handleSubmit}>
  <Input
    name="email"
    value={values.email}
    onChange={handleChange}
    error={errors.email}
  />
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </Button>
</form>
```

---

### useToast Hook
**Location**: `src/hooks/useToast.js`

```jsx
import { useToast } from './hooks/useToast';

const { success, error, warning, info } = useToast();

// Usage
success('Operation successful!');
error('Something went wrong');
warning('Are you sure?');
info('FYI...');
```

---

## 📊 Pages

### HomePage
**Location**: `src/pages/HomePage.jsx`

- Hero section with CTA
- Product grid with filtering
- Category buttons
- Price range slider
- FAQ accordion
- Search functionality

---

### ProductDetailPage
**Location**: `src/pages/ProductDetailPage.jsx`

- Product image
- Price and discount
- Rating and reviews
- Quantity selector
- Add to cart button
- Product description

---

### CheckoutPage
**Location**: `src/pages/CheckoutPage.jsx`

- 3-step checkout process
- Delivery address form
- Payment details form
- Order review
- Step indicators
- Order summary sidebar

---

### UserDashboard
**Location**: `src/pages/UserDashboard.jsx`

- User profile display
- Edit profile modal
- Order history list
- Statistics cards
- Logout button

---

### VendorDashboard
**Location**: `src/pages/VendorDashboard.jsx`

- Dashboard statistics
- Product table
- Add product button
- Edit/delete functionality
- Stock status badges

---

### DeliveryPartnerUI
**Location**: `src/pages/DeliveryPartnerUI.jsx`

- Order list
- Order details panel
- Accept order button
- Update status buttons
- Dashboard statistics

---

### Authentication Pages
- `UserLoginPage.jsx` - Customer login/signup
- `VendorLoginPage.jsx` - Vendor registration
- `DeliveryLoginPage.jsx` - Delivery partner signup

---

## 🛠️ Utility Functions

### validators.js
```jsx
validateEmail(email)      // Returns boolean
validatePassword(pwd)     // Min 6 chars
validatePhone(phone)      // 10 digits
formatPrice(price)        // Returns formatted string
formatDate(date)          // Returns formatted date string
```

### mockData.js
```jsx
import {
  mockProducts,      // 8 products
  mockVendors,       // 2 vendors
  mockDeliveryOrders,// 3 orders
  categories,        // 5 categories
  faqItems           // 5 FAQ items
} from './utils/mockData';
```

---

## 🎯 Quick Tips

1. **Always wrap components in providers:**
   ```jsx
   <AuthProvider>
     <CartProvider>
       <NotificationProvider>
         <App />
       </NotificationProvider>
     </CartProvider>
   </AuthProvider>
   ```

2. **Use ToastContainer once in your app:**
   ```jsx
   <ToastContainer /> {/* Put in App.jsx */}
   ```

3. **Cart drawer works automatically:**
   - Just include `<CartDrawer />` in your page
   - It uses `useCart()` internally

4. **Forms use useForm hook:**
   - Provides validation, error handling, submission state
   - Automatically handles `onChange` and `onSubmit`

5. **Icons from lucide-react:**
   ```jsx
   import { ShoppingCart, User, LogOut } from 'lucide-react';
   <ShoppingCart size={24} />
   ```

---

## 📦 Component Sizes

**Button & Input:**
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large

**Modal:**
- `sm` - Small width
- `md` - Medium width (default)
- `lg` - Large width
- `xl` - Extra large width

---

## 🎨 Styling

All components use Tailwind CSS classes. Global styles in `src/index.css`:

```css
.btn-primary      /* Orange button */
.btn-secondary    /* Gray button */
.btn-danger       /* Red button */
.card             /* Card styling */
.input-field      /* Input styling */
```

---

## 🚀 Creating New Components

1. Create file in `src/components/`
2. Import Tailwind and icons as needed
3. Export as default or named export
4. Add to `src/components/index.js`

Example:
```jsx
// src/components/Badge.jsx
export const Badge = ({ text, variant = 'primary' }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
      variant === 'primary' ? 'bg-primary text-white' : 'bg-gray-200'
    }`}>
      {text}
    </span>
  );
};
```

---

**Happy Building! 🎉**
