import { useNotification } from '../context/NotificationContext';

export const useToast = () => {
  const { showToast } = useNotification();

  return {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    warning: (message) => showToast(message, 'warning'),
    info: (message) => showToast(message, 'info'),
  };
};
