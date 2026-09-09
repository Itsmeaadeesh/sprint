import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, List, Calendar, Settings, Plus } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickAdd: () => void;
  onOpenCreateList: () => void;
  onNavigateSettings: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenQuickAdd,
  onOpenCreateList,
  onNavigateSettings,
}) => {
  const { tasks, lists, setSelectedListId, setViewMode } = useBoard();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  const filteredLists = lists
    .filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg editorial-card shadow-2xl overflow-hidden bg-[var(--bg)] text-[var(--fg)]"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b-3 border-[var(--line)]">
              <Search className="w-4 h-4 text-[var(--muted)] stroke-[2.5]" />
              <input
                type="text"
                placeholder="TYPE A COMMAND OR SEARCH..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-xs font-bold uppercase tracking-wider text-[var(--fg)] placeholder:text-[var(--muted)] outline-none"
              />
              <kbd className="px-2 py-0.5 border border-[var(--line)] text-[10px] font-mono font-bold text-[var(--muted)] bg-[var(--surface)]">
                ESC
              </kbd>
            </div>

            {/* Results Area */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-3 text-xs">
              {/* Commands */}
              <div>
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                  Actions / Quick Nav
                </div>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => {
                      onOpenQuickAdd();
                      onClose();
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 text-[var(--fg)] hover:bg-[var(--line)] hover:text-[var(--bg)] text-left transition-colors cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>New Task</span>
                    </div>
                    <kbd className="text-[10px] font-mono">N / C</kbd>
                  </button>

                  <button
                    onClick={() => {
                      onOpenCreateList();
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-[var(--fg)] hover:bg-[var(--line)] hover:text-[var(--bg)] text-left transition-colors cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <List className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Create New List</span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('calendar');
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-[var(--fg)] hover:bg-[var(--line)] hover:text-[var(--bg)] text-left transition-colors cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Switch to Calendar</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateSettings();
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-[var(--fg)] hover:bg-[var(--line)] hover:text-[var(--bg)] text-left transition-colors cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <Settings className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Settings &amp; Preferences</span>
                  </button>
                </div>
              </div>

              {/* Tasks */}
              {query && filteredTasks.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                    Matching Tasks
                  </div>
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onClose()}
                      className="flex items-center justify-between px-3 py-2 text-[var(--fg)] hover:bg-[var(--line)] hover:text-[var(--bg)] cursor-pointer font-bold uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={`task-box ${t.completed ? 'checked' : ''}`}
                        />
                        <span className={t.completed ? 'line-through text-[var(--muted)]' : ''}>
                          {t.title}
                        </span>
                      </div>
                      <span className="task-tag text-[9px]">
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Lists */}
              {query && filteredLists.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                    Matching Lists
                  </div>
                  {filteredLists.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        setSelectedListId(l.id);
                        setViewMode('board');
                        onClose();
                      }}
                      className="flex items-center justify-between px-3 py-2 text-[var(--fg)] hover:bg-[var(--line)] hover:text-[var(--bg)] cursor-pointer font-bold uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 border border-current"
                          style={{ backgroundColor: l.color }}
                        />
                        <span>{l.name}</span>
                      </div>
                      <span className="text-[10px] text-[var(--muted)]">Jump →</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3.5 py-2 border-t border-white/[0.06] bg-[#0c0e14] text-[10px] text-slate-500 font-mono">
              <span>Navigation ↑↓</span>
              <span>Open ↵</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
