import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateList: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateList }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[480px] w-full p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center max-w-sm p-6 rounded-xl linear-surface"
      >
        <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 text-slate-400">
          <Layers className="w-5 h-5" />
        </div>

        <h3 className="text-sm font-semibold text-white mb-1.5">
          No lists yet
        </h3>
        
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Create a list like Engineering, Backlog, or Personal to start organizing your issues.
        </p>

        <button
          onClick={onCreateList}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-slate-100 font-medium text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Create list</span>
        </button>

        <div className="mt-5 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 text-[10px]">
            ⌘K
          </kbd>
          <span>for commands</span>
        </div>
      </motion.div>
    </div>
  );
};
