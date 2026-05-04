import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

export const Alert = ({ type = 'info', title, message, onClose }) => {
  const icons = {
    success: <CheckCircle size={20} className="text-green-600" />,
    error: <XCircle size={20} className="text-red-600" />,
    warning: <AlertCircle size={20} className="text-yellow-600" />,
    info: <Info size={20} className="text-blue-600" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const titleColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  const messageColors = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${bgColors[type] || bgColors.info}`}
    >
      {icons[type]}
      <div className="flex-1">
        {title && <h4 className={`font-semibold ${titleColors[type]}`}>{title}</h4>}
        {message && <p className={`text-sm ${messageColors[type]}`}>{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`text-sm font-medium underline hover:no-underline ${titleColors[type]}`}
        >
          Dismiss
        </button>
      )}
    </div>
  );
};
