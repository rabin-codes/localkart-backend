import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onLogoClick, onMenuToggle, menuOpen }) => {
  const { getCartCount, setShowCart } = useCart();
  const { isAuthenticated, logout, user, userRole } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const showUserCart = isAuthenticated && userRole === 'user';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            onClick={onLogoClick}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LK</span>
            </div>
            <span className="text-xl font-bold text-secondary hidden sm:inline">LocalKart</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name?.split(' ')[0]}
                </span>
              )}

              {showUserCart ? (
                <button
                  onClick={() => setShowCart(true)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingCart size={24} className="text-secondary" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              ) : null}

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-secondary hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              )}
            </div>
          </div>

          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
