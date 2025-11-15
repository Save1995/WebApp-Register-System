
import React, { useContext } from 'react';
import { ToastContext } from '../ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
    const context = useContext(ToastContext);

    if (!context) {
        return null;
    }
    
    const { toasts, removeToast } = context;

    return (
         <div className="fixed top-5 right-5 z-[100] w-full max-w-xs">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    )
};

export default ToastContainer;
