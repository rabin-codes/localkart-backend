import React from 'react';
import { X, Heart } from 'lucide-react';
import { Button } from './Button';

export const PopupModal = ({ isOpen, onClose, title, children, size = 'md', showFavorite = false }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`bg-white rounded-2xl shadow-2xl z-50 relative w-full ${sizes[size]} animate-slideIn max-h-96 overflow-y-auto`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-secondary">{title}</h2>
          <div className="flex items-center gap-2">
            {showFavorite && (
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart size={20} className="text-primary" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
