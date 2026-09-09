import React from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, Sparkles, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateList: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateList }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center max-w-md p-8 rounded-3xl glass-card border border-white/10 shadow-2xl"
      >
        {/* Ambient Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-3xl blur-xl -z-10" />

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 flex items-center justify-center mb-6 shadow-inner">
          <FolderPlus className="w-8 h-8 text-blue-400" />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          Clean Slate
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2">
          Your workspace is empty
        </h3>
        
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Sprint organizes your focus into dedicated lists like Projects, Backlog, or Personal. Create your first list to start tracking work.
        </p>

        <button
          onClick={onCreateList}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-medium text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create your first list
        </button>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
          <span>Tip: Press</span>
          <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-mono text-[10px]">
            ⌘K
          </kbd>
          <span>anytime for quick actions</span>
        </div>
      </motion.div>
    </div>
  );
};
