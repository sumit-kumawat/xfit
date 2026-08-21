import React from 'react';
import { useApp } from '../../context/AppContext';
import { ToastNotification } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast: ToastNotification) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#ba1a1a] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#f59e0b] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#545c86] shrink-0" />,
        };

        const bgBorders = {
          success: 'bg-white border-[#10b981]/30 text-[#0b1c30]',
          error: 'bg-white border-[#ba1a1a]/30 text-[#0b1c30]',
          warning: 'bg-white border-[#f59e0b]/30 text-[#0b1c30]',
          info: 'bg-white border-[#545c86]/30 text-[#0b1c30]',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-[0_8px_24px_rgba(15,24,62,0.12)] transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${bgBorders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
              <p className="text-xs text-gray-600 mt-0.5 leading-normal">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
