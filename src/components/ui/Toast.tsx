import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, RotateCcw, X } from 'lucide-react';
import type { ToastNotification } from '../../types';

interface ToastProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-[var(--bg)] text-[var(--fg)] border-3 border-[var(--line)] shadow-2xl min-w-[320px] max-w-md"
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 stroke-[2.5]" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 stroke-[2.5]" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[var(--accent)] stroke-[2.5]" />}
            {toast.type === 'undo' && <CheckCircle2 className="w-5 h-5 text-[var(--accent)] stroke-[2.5]" />}
          </div>

          <div className="flex-1 text-xs font-bold uppercase tracking-wider text-[var(--fg)] truncate">
            {toast.message}
          </div>

          {toast.onUndo && (
            <button
              onClick={() => {
                toast.onUndo?.();
                onDismiss();
              }}
              className="editorial-btn-secondary flex items-center gap-1.5 py-1 px-2.5 text-[10px]"
            >
              <RotateCcw className="w-3 h-3 stroke-[2.5]" />
              UNDO
            </button>
          )}

          <button
            onClick={onDismiss}
            className="text-[var(--muted)] hover:text-[var(--fg)] p-1 border border-transparent hover:border-[var(--line)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
