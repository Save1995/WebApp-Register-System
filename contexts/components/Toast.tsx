
import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../ToastContext';
import { SuccessIcon, ErrorIcon } from './icons/Icons';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      // Wait for the fade-out animation to complete before removing
      setTimeout(() => onRemove(toast.id), 500);
    }, 3000); // Toast visible for 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onRemove]);

  const bgColor = toast.type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = toast.type === 'success' ? <SuccessIcon /> : <ErrorIcon />;

  return (
    <div
      className={`flex items-center p-4 mb-4 text-white rounded-lg shadow-lg transition-opacity duration-500 ${bgColor} ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-3 text-sm font-medium">{toast.message}</div>
    </div>
  );
};

export default Toast;
