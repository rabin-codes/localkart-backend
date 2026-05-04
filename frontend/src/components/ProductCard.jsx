import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Card } from './Card';

const DEFAULT_IMAGE = 'https://picsum.photos/400/300';

export const ProductCard = ({ product, onViewDetail }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const resolveImagePath = () => {
    if (imageError) return `https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80`;
    
    const img = product.image || product.imageUrl;
    if (!img) return `https://picsum.photos/seed/${product.id}/400/300`;

    if (!img.startsWith('http') && !img.startsWith('data:')) {
      return `/uploads/${img}`;
    }
    
    return img;
  };

  return (
    <Card
      className="flex flex-col h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      hoverable={true}
    >
      <div
        onClick={() => onViewDetail && onViewDetail()}
        className="mb-3 h-48 bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center"
      >
        <img
          src={resolveImagePath()}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={() => setImageError(true)}
        />
      </div>

      <div className="flex-1 flex flex-col p-3">
        <h3 className="font-bold text-secondary text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2 italic">
          {product.shopName || 'LocalKart Vendor'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-lg font-bold text-primary">₹{product.price}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xs text-gray-400 line-through">₹{product.originalPrice}</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 bg-primary text-white rounded-full hover:bg-orange-600 transition-colors shadow-md"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </Card>
  );
};