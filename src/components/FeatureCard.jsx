import React from 'react';

export const FeatureCard = ({ icon, title, description, gradient = 'from-primary to-orange-500' }) => {
  return (
    <div className="group hover:shadow-xl transition-all duration-300">
      <div
        className={`h-20 rounded-t-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-4xl group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div className="bg-white p-6 rounded-b-lg">
        <h3 className="font-bold text-secondary mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};
