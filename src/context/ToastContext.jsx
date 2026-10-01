import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'success', duration = 4500 }) => {
    const id = 	oast--;
    const newToast = { id, title, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((message, title = 'Success') => {
    addToast({ title, message, type: 'success' });
  }, [addToast]);

  const showError = useCallback((message, title = 'Error') => {
    addToast({ title, message, type: 'error' });
  }, [addToast]);

  const showInfo = useCallback((message, title = 'Notice') => {
    addToast({ title, message, type: 'info' });
  }, [addToast]);

  const showWarning = useCallback((message, title = 'Warning') => {
    addToast({ title, message, type: 'warning' });
  }, [addToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning
      }}
    >
      {children}
      {/* Fixed Toast Container */}
      <div className='fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0'>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-3 duration-300 ${
              toast.type === "success"
                ? "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100"
                : toast.type === "error"
                ? "bg-rose-50/95 dark:bg-rose-950/90 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100"
                : toast.type === "warning"
                ? "bg-amber-50/95 dark:bg-amber-950/90 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100"
                : "bg-slate-50/95 dark:bg-slate-900/95 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            }`}
          >
            <div className='shrink-0 mt-0.5'>
              {toast.type === 'success' && <CheckCircle2 className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />}
              {toast.type === 'error' && <AlertCircle className='w-5 h-5 text-rose-600 dark:text-rose-400' />}
              {toast.type === 'warning' && <AlertTriangle className='w-5 h-5 text-amber-600 dark:text-amber-400' />}
              {toast.type === 'info' && <Info className='w-5 h-5 text-sky-600 dark:text-sky-400' />}
            </div>

            <div className='flex-1 pr-1'>
              {toast.title && (
                <h5 className='text-xs font-bold leading-tight mb-0.5'>{toast.title}</h5>
              )}
              <p className='text-xs leading-relaxed opacity-90'>{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className='shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-0.5 rounded'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
