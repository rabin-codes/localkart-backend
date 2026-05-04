import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './Button';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cart,
    showCart,
    setShowCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    isCartLoading,
  } = useCart();

  const total = getTotalPrice();

  const handleCheckout = () => {
    setShowCart(false);
    navigate('/checkout');
  };

  return (
    <>
      {showCart && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setShowCart(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-xl z-40 transform transition-transform duration-300 ${
          showCart ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <ShoppingBag size={24} className="text-primary" />
              Cart
            </h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {isCartLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Loading your cart...</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map((item) => {
                  const imgSrc = (() => {
                    const src = item.productImage || item.imageUrl || item.image;
                    if (!src) return `https://picsum.photos/seed/${item.productId}/80/80`;
                    if (src.startsWith('http') || src.startsWith('data:')) return src;
                    return `/uploads/${src}`;
                  })();
                  return (
                  <div
                    key={`cart-item-${item.itemId || item.productId}`}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                  >

                    <img
                      src={imgSrc}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.productId || 'item'}/80`; }}
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary text-sm mb-1 line-clamp-1">
                        {item.productName}
                      </h4>
                      <p className="text-primary font-bold mb-2">₹{item.price}</p>

                      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg w-fit">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                          }
                          className="p-1 hover:bg-gray-100"
                        >
                          <Minus size={16} className="text-secondary" />
                        </button>
                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Plus size={16} className="text-secondary" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  );
                })}
              </div>


              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary text-2xl">₹{total.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
