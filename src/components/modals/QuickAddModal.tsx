import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, Folder } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg rounded-xl linear-surface shadow-2xl p-5 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-xs font-semibold text-slate-200">New Issue</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Issue title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  required
                  className="w-full text-sm font-medium px-3 py-2 rounded-md linear-input placeholder:text-slate-600"
                />
              </div>

              <div>
                <textarea
                  placeholder="Add description or markdown..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs px-3 py-2 rounded-md linear-input placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* Selectors Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <Folder className="w-2.5 h-2.5" />
                    List
                  </label>
                  <select
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    required
                    className="w-full text-xs px-2.5 py-1.5 rounded-md linear-input bg-[#0c0e14]"
                  >
                    {lists.map((l) => (
                      <option key={l.id} value={l.id} className="bg-[#0c0e14] text-white">
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <Flag className="w-2.5 h-2.5" />
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-md linear-input bg-[#0c0e14]"
                  >
                    <option value="low" className="bg-[#0c0e14] text-white">Low</option>
                    <option value="medium" className="bg-[#0c0e14] text-white">Medium</option>
                    <option value="high" className="bg-[#0c0e14] text-white">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-md linear-input bg-[#0c0e14]"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] mt-2">
                <span className="text-[10px] font-mono text-slate-500">
                  Press ↵ to create
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !title.trim() || !listId}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-md bg-white text-black hover:bg-slate-200 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {submitting ? 'Creating...' : 'Create Issue'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
