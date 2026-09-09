import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateList: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateList }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[440px] w-full p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center max-w-sm p-8 editorial-card bg-[var(--bg)]"
      >
        <div className="w-12 h-12 border-2 border-[var(--line)] bg-[var(--surface)] flex items-center justify-center mb-5 text-[var(--accent)]">
          <Layers className="w-6 h-6 stroke-[2.5]" />
        </div>

        <h3 className="font-heading text-lg font-black uppercase tracking-tight text-[var(--fg)] mb-2">
          No Columns Active
        </h3>
        
        <p className="text-xs text-[var(--muted)] mb-6 leading-relaxed">
          Create a list column such as Product, Backlog, or Operations to structure your sprint workflow.
        </p>

        <button
          onClick={onCreateList}
          className="editorial-btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Column</span>
        </button>

        <div className="mt-6 pt-4 border-t-2 border-[var(--line)] w-full flex items-center justify-center gap-2 text-[10px] text-[var(--muted)] font-mono font-bold uppercase tracking-wider">
          <span>SHORTCUT:</span>
          <kbd className="px-1.5 py-0.5 border border-[var(--line)] bg-[var(--surface)] text-[var(--fg)]">
            ⌘K
          </kbd>
        </div>
      </motion.div>
    </div>
  );
};
