import React from 'react';

export const Badge = ({ text, variant = 'primary', size = 'md', icon, animated = true }) => {
  const variants = {
    primary: 'bg-primary text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold transition-all ${
        variants[variant]
      } ${sizes[size]} ${animated ? 'hover:shadow-lg' : ''}`}
    >
      {icon && <span>{icon}</span>}
      {text}
    </span>
  );
};
