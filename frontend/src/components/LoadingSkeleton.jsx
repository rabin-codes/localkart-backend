import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
};
