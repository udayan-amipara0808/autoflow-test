import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ toasts, dismissToast }) => {
    const getToastClass = (type) => {
        const base = "pointer-events-auto flex items-start p-4 rounded-lg shadow-lg border animate-slide-in ";
        if (type === 'success') return base + "bg-green-500/10 border-green-500/20 text-green-100";
        if (type === 'error') return base + "bg-red-500/10 border-red-500/20 text-red-100";
        if (type === 'warning') return base + "bg-yellow-500/10 border-yellow-500/20 text-yellow-100";
        return base + "bg-blue-500/10 border-blue-500/20 text-blue-100";
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={getToastClass(toast.type)}
                >
                    <div className="flex-shrink-0 mt-0.5">
                        {toast.type === 'success' && <CheckCircle size={18} className="text-green-500" />}
                        {toast.type === 'error' && <XCircle size={18} className="text-red-500" />}
                        {toast.type === 'warning' && <AlertTriangle size={18} className="text-yellow-500" />}
                        {toast.type === 'info' && <Info size={18} className="text-blue-500" />}
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium">{toast.title}</h3>
                        {toast.message && <p className="mt-1 text-xs opacity-90">{toast.message}</p>}
                    </div>
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="ml-4 flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;
