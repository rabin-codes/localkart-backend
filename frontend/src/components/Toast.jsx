import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastItem = ({ notification, onRemove }) => {
  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    warning: <AlertCircle size={20} className="text-yellow-500" />,
    info: <Info size={20} className="text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border ${bgColors[notification.type] || bgColors.info} animate-slideIn`}
    >
      {icons[notification.type]}
      <p className={`flex-1 font-medium ${textColors[notification.type]}`}>
        {notification.message}
      </p>
      <button
        onClick={() => onRemove(notification.id)}
        className="text-gray-500 hover:text-gray-700"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 max-w-sm">
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};
