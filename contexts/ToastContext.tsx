
import React, { createContext, useState, useCallback, ReactNode } from 'react';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error') => void;
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
  }, []);
  
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
