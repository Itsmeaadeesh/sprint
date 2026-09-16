import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus, Check } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import { LIST_COLORS } from '../../lib/utils';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({ isOpen, onClose }) => {
  const { createList } = useBoard();
  const [name, setName] = useState('');
  const [color, setColor] = useState(LIST_COLORS[0].hex);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    await createList(name.trim(), color);
    setSubmitting(false);
    setName('');
    setColor(LIST_COLORS[0].hex);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md editorial-card shadow-2xl p-4 sm:p-6 relative bg-[var(--bg)] text-[var(--fg)] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 border-2 border-[var(--line)] bg-[var(--surface)] flex items-center justify-center text-[var(--accent)]">
                  <FolderPlus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="font-heading text-sm font-black uppercase tracking-wider text-[var(--fg)]">
                  Create New List Column
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="min-w-[40px] min-h-[40px] flex items-center justify-center border border-transparent hover:border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  List Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. MARKETING, BACKLOG, SHIP..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                  className="editorial-input w-full text-xs font-bold uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                  Category Color Tag
                </label>
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  {LIST_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      aria-label={`Select color ${c.name || c.hex}`}
                      onClick={() => setColor(c.hex)}
                      className="w-9 h-9 sm:w-8 sm:h-8 border-2 border-[var(--line)] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      style={{ backgroundColor: c.hex }}
                    >
                      {color === c.hex && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t-2 border-[var(--line)]">
                <button
                  type="button"
                  onClick={onClose}
                  className="editorial-btn-secondary min-h-[44px] px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="editorial-btn-primary min-h-[44px] px-4 cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
