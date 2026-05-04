import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialCard = ({ name, role, image, text, rating }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow animate-fadeIn">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
      
      <p className="text-gray-600 mb-4 italic">"{text}"</p>
      
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-secondary">{name}</p>
          <p className="text-xs text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
};
