import React from 'react';
import { AlertTriangle, AlertOctagon, X } from 'lucide-react';

interface DangerConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export const DangerConfirmModal: React.FC<DangerConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Dialog Body */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="danger-dialog-title"
        className="relative bg-white rounded-[10px] shadow-2xl border border-slate-200 w-full max-w-md p-6 z-10 animate-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-[8px] hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 border ${
              isDanger
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}
          >
            {isDanger ? (
              <AlertOctagon className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h3
              id="danger-dialog-title"
              className="text-base font-extrabold text-slate-900 tracking-tight"
            >
              {title}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {message}
            </p>
            {itemName && (
              <div className="mt-2.5 p-2 bg-slate-50 rounded-[8px] border border-slate-200 text-xs font-mono font-bold text-slate-800 truncate">
                {itemName}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[10px] text-xs font-bold transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-[10px] text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
