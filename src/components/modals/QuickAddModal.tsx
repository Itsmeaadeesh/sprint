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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg editorial-card p-6 shadow-2xl relative text-[var(--fg)] bg-[var(--bg)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[var(--accent)]" />
                <span className="font-heading text-xs font-black uppercase tracking-wider text-[var(--fg)]">
                  Add New Task Entry
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 border border-transparent hover:border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Task Heading
                </label>
                <input
                  type="text"
                  placeholder="e.g. SHIP POSTER LAYOUT"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  required
                  className="editorial-input w-full text-xs font-bold uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Task Notes / Scope
                </label>
                <textarea
                  placeholder="Notes, references, or instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="editorial-input w-full text-xs resize-none"
                />
              </div>

              {/* Selectors Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1 flex items-center gap-1">
                    <Folder className="w-3 h-3 stroke-[2.5]" />
                    Target List
                  </label>
                  <select
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    required
                    className="editorial-input w-full text-xs bg-[var(--bg)]"
                  >
                    {lists.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1 flex items-center gap-1">
                    <Flag className="w-3 h-3 stroke-[2.5]" />
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="editorial-input w-full text-xs bg-[var(--bg)]"
                  >
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 stroke-[2.5]" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="editorial-input w-full text-xs bg-[var(--bg)]"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-[var(--line)] mt-3">
                <span className="text-[10px] font-bold font-mono text-[var(--muted)] uppercase">
                  PRESS ↵ TO COMMIT
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="editorial-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !title.trim() || !listId}
                    className="editorial-btn-primary"
                  >
                    {submitting ? 'Creating...' : 'Create Task'}
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
