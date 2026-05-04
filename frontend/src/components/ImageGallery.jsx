import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ImageGallery = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const defaultImages = images.length > 0 ? images : [
    '/images/tomato.svg',
    '/images/pepper.svg',
    '/images/spinach.svg',
  ];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96">
        <img
          src={defaultImages[selectedIndex]}
          alt="Product"
          className="w-full h-full object-cover"
        />
        {defaultImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + defaultImages.length) % defaultImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % defaultImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      {defaultImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {defaultImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
