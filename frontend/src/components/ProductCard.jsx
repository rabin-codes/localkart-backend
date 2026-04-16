import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Card } from './Card';
import { Button } from './Button';

const DEFAULT_IMAGE = 'https://via.placeholder.com/400x300?text=Product+Image';

export const ProductCard = ({ product, onViewDetail }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail();
    }
  };

  const displayImage =
    imageError || !(product.image || product.imageUrl)
      ? DEFAULT_IMAGE
      : product.image || product.imageUrl;

  return (
    <Card
      className="flex flex-col h-full cursor-pointer transition-transform duration-300 hover:scale-105"
      hoverable={true}
    >
      <div
        onClick={handleViewDetail}
        className="mb-3 h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <h3
          onClick={handleViewDetail}
          className="font-semibold text-secondary text-sm mb-1 line-clamp-2"
        >
          {product.name}
        </h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-1">{product.vendor}</p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-lg font-bold text-primary">₹{product.price}</p>
            {product.originalPrice && (
              <p className="text-xs text-gray-500 line-through">₹{product.originalPrice}</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
};
