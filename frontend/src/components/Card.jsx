import React from 'react';

export const Card = ({ children, className = '', hoverable = true, ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 transition-shadow duration-300 ${
        hoverable ? 'hover:shadow-lg' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
