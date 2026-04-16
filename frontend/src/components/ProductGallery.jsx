import React, { useState } from 'react';
import { Star, Heart, Share2 } from 'lucide-react';

export const ProductGallery = ({ product, onAddToCart }) => {
  const [favorites, setFavorites] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product.images || [product.image];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Main Image Section */}
      <div className="space-y-4">
        <div className="relative bg-gray-100 rounded-xl overflow-hidden h-96 md:h-full">
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />

          {/* Favorite Button */}
          <button
            onClick={() => setFavorites(!favorites)}
            className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
              favorites
                ? 'bg-red-500 text-white'
                : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800'
            }`}
          >
            <Heart size={24} fill={favorites ? 'currentColor' : 'none'} />
          </button>

          {/* Discount Badge */}
          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
        </div>

        {/* Image Thumbnails */}
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`h-20 rounded-lg border-2 overflow-hidden transition-all ${
                selectedImage === idx ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-primary uppercase">
            {product.category || 'Products'}
          </p>
          <h1 className="text-4xl font-bold text-secondary mt-2">{product.name}</h1>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="border-y border-gray-200 py-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl font-bold text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-2xl text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <p className="text-green-600 font-semibold">🎉 Free delivery on orders above ₹200</p>
        </div>

        {/* Vendor Section */}
        {product.vendor && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Sold by</p>
            <p className="font-bold text-secondary flex items-center gap-2">
              {product.vendor}
              {product.vendorVerified && <span className="text-green-600">✓</span>}
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{product.description}</p>

        {/* Quantity & Add to Cart */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-secondary">Quantity:</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-6 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              for (let i = 0; i < quantity; i++) {
                onAddToCart();
              }
            }}
            className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all"
          >
            🛒 Add to Cart
          </button>

          <button className="w-full py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-orange-50 transition-all">
            💬 Share with Friends
          </button>
        </div>

        {/* Features */}
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <p className="font-semibold text-secondary">✓ 100% Authentic</p>
          <p className="font-semibold text-secondary">✓ 30-day return guarantee</p>
          <p className="font-semibold text-secondary">✓ Secured transactions</p>
        </div>
      </div>
    </div>
  );
};
