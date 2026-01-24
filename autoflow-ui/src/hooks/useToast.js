import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback(({ type, title, message, duration = 5000 }) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, title, message, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                dismissToast(id);
            }, duration);
        }
        return id;
    }, [dismissToast]);

    const value = { toasts, showToast, dismissToast };

    return React.createElement(ToastContext.Provider, { value: value }, children);
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
