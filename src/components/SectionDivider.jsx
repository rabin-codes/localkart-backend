import React from 'react';

export const SectionDivider = ({ title, subtitle, icon }) => {
  return (
    <div className="py-16 px-4 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h2 className="text-4xl font-bold text-secondary mb-2">{title}</h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>
      <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-500 mx-auto mt-6" />
    </div>
  );
};
