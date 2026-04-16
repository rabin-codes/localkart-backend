import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormSection = ({ title, description, children, required = false }) => {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
          {title}
          {required && <span className="text-red-500">*</span>}
        </h3>
        {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        {children}
      </div>
    </div>
  );
};
