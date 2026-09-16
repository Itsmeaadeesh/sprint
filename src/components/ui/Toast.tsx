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
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[var(--bg)] text-[var(--fg)] border-3 border-[var(--line)] shadow-2xl w-[calc(100vw-24px)] sm:w-auto min-w-[280px] sm:min-w-[320px] max-w-md"
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
              className="editorial-btn-secondary flex items-center gap-1.5 min-h-[38px] px-3 text-[10px] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>UNDO</span>
            </button>
          )}

          <button
            onClick={onDismiss}
            aria-label="Dismiss toast"
            className="text-[var(--muted)] hover:text-[var(--fg)] min-w-[40px] min-h-[40px] flex items-center justify-center border border-transparent hover:border-[var(--line)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
