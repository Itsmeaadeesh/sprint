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
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-900/90 dark:bg-[#16181f]/95 text-slate-100 border border-white/10 shadow-2xl backdrop-blur-xl min-w-[320px] max-w-md"
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            {toast.type === 'undo' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
          </div>

          <div className="flex-1 text-sm font-medium text-slate-200 truncate">
            {toast.message}
          </div>

          {toast.onUndo && (
            <button
              onClick={() => {
                toast.onUndo?.();
                onDismiss();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo
            </button>
          )}

          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
