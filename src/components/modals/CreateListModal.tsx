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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-3xl glass-card border border-white/10 shadow-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Create New List</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  List Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Roadmap, Personal, Design Sprint..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                  className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl glass-input placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  {LIST_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setColor(c.hex)}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center border border-white/20 shadow-sm cursor-pointer"
                      style={{ backgroundColor: c.hex }}
                    >
                      {color === c.hex && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white disabled:opacity-50 shadow-lg shadow-violet-500/25 transition-all cursor-pointer"
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
