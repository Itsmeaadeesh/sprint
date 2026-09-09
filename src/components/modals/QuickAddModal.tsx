import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, Folder, Sparkles } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import type { TaskPriority } from '../../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string | null;
  defaultListId?: string;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  defaultDate = null,
  defaultListId,
}) => {
  const { lists, createTask } = useBoard();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listId, setListId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(defaultDate || '');
      setListId(defaultListId || (lists[0]?.id ?? ''));
    }
  }, [isOpen, defaultDate, defaultListId, lists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !listId) return;

    setSubmitting(true);
    await createTask({
      title: title.trim(),
      list_id: listId,
      description: description.trim() || undefined,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    });
    setSubmitting(false);
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
            className="w-full max-w-lg rounded-3xl glass-card border border-white/10 shadow-2xl p-6 relative overflow-hidden"
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-blue-500/15 to-transparent blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create New Task</h3>
                  <p className="text-xs text-slate-400">Press ⌘Enter to save immediately</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  required
                  className="w-full text-base font-medium px-3.5 py-2.5 rounded-xl glass-input placeholder:text-slate-500"
                />
              </div>

              <div>
                <textarea
                  placeholder="Add notes, context, or links (optional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl glass-input placeholder:text-slate-500 resize-none"
                />
              </div>

              {/* Selectors Row: List, Priority, Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* List selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                    <Folder className="w-3 h-3 text-blue-400" />
                    List
                  </label>
                  <select
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl glass-input bg-[#12141a]"
                  >
                    {lists.map((l) => (
                      <option key={l.id} value={l.id} className="bg-[#12141a] text-white">
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                    <Flag className="w-3 h-3 text-amber-400" />
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full text-xs px-3 py-2 rounded-xl glass-input bg-[#12141a]"
                  >
                    <option value="low" className="bg-[#12141a] text-white">Low</option>
                    <option value="medium" className="bg-[#12141a] text-white">Medium</option>
                    <option value="high" className="bg-[#12141a] text-white">High</option>
                  </select>
                </div>

                {/* Due Date picker */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl glass-input bg-[#12141a]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !title.trim() || !listId}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white disabled:opacity-50 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
