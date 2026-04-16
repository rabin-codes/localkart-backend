import React, { createContext, useState, useCallback, useEffect } from 'react';

import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { cartApi } from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const syncCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    setIsCartLoading(true);

    try {
      const response = await cartApi.getCart();
      setCart(response?.items || []);
    } catch (error) {
      setCart([]);
      showToast(error.message || 'Unable to load your cart.', 'error');
    } finally {
      setIsCartLoading(false);
    }
  }, [isAuthenticated, showToast]);

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const addToCart = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        showToast('Please sign in to add items to your cart.', 'warning');
        return false;
      }

      try {
        const response = await cartApi.addItem(product.id, product.quantity || 1);
        setCart(response?.items || []);
        showToast(`${product.name} added to cart.`, 'success');
        return true;
      } catch (error) {
        showToast(error.message || 'Unable to update cart.', 'error');
        return false;
      }
    },
    [isAuthenticated, showToast],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        const response = await cartApi.removeItem(productId);
        setCart(response?.items || []);
      } catch (error) {
        showToast(error.message || 'Unable to remove item.', 'error');
      }
    },
    [showToast],
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      try {
        const response = await cartApi.updateItem(productId, quantity);
        setCart(response?.items || []);
      } catch (error) {
        showToast(error.message || 'Unable to update item quantity.', 'error');
      }
    },
    [showToast],
  );

  const clearCart = useCallback(
    async ({ silent = false, skipRequest = false } = {}) => {
      try {
        if (!skipRequest && isAuthenticated) {
          await cartApi.clear();
        }

        setCart([]);

        if (!silent) {
          showToast('Cart cleared.', 'info');
        }
      } catch (error) {
        showToast(error.message || 'Unable to clear cart.', 'error');
      }
    },
    [isAuthenticated, showToast],
  );

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    showCart,
    setShowCart,
    isCartLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getCartCount,
    refreshCart: syncCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
