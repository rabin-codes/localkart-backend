import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar, CartDrawer, ToastContainer } from './components';
import {
  HomePage,
  ProductDetailPage,
  UserDashboard,
  CheckoutPage,
  VendorDashboard,
  DeliveryPartnerUI,
  UserLoginPage,
  VendorLoginPage,
  DeliveryLoginPage,
  LandingPage,
} from './pages';
import './index.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { userRole, isAuthenticated, isLoading } = useAuth();
  
  // Check localStorage as fallback
  const storedRole = localStorage.getItem('userRole');
  const role = userRole || storedRole;
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated || !role || role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppShell = ({ children, homePath = '/home', showCart = true }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Navbar
        onLogoClick={() => navigate(homePath)}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        menuOpen={menuOpen}
      />
      {children}
      {showCart ? <CartDrawer /> : null}
    </>
  );
};

const AppContent = () => {
  const { logout } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Login Routes */}
      <Route path="/user-login" element={<UserLoginPage />} />
      <Route path="/vendor-login" element={<VendorLoginPage />} />
      <Route path="/delivery-login" element={<DeliveryLoginPage />} />

      {/* User Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute requiredRole="user">
            <AppShell homePath="/home">
              <HomePage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute requiredRole="user">
            <AppShell homePath="/home">
              <ProductDetailPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <AppShell homePath="/home">
              <UserDashboard onLogout={logout} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute requiredRole="user">
            <AppShell homePath="/home" showCart={false}>
              <CheckoutPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Vendor Routes */}
      <Route
        path="/vendor-dashboard"
        element={
          <ProtectedRoute requiredRole="vendor">
            <AppShell homePath="/vendor-dashboard" showCart={false}>
              <VendorDashboard onLogout={logout} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Delivery Partner Routes */}
      <Route
        path="/delivery-dashboard"
        element={
          <ProtectedRoute requiredRole="delivery">
            <AppShell homePath="/delivery-dashboard" showCart={false}>
              <DeliveryPartnerUI onLogout={logout} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-white">
              <AppContent />
              <ToastContainer />
            </div>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
