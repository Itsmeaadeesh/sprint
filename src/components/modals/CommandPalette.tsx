import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, List, Calendar, Settings, Plus, CheckCircle2 } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg rounded-xl linear-surface shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-white/[0.08]">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 outline-none"
              />
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-500">
                ESC
              </kbd>
            </div>

            {/* Results Area */}
            <div className="max-h-72 overflow-y-auto p-1.5 space-y-2 text-xs">
              {/* Commands */}
              <div>
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      onOpenQuickAdd();
                      onClose();
                    }}
                    className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-slate-200 hover:text-white hover:bg-white/[0.06] text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5 text-slate-400" />
                      <span>New Issue</span>
                    </div>
                    <kbd className="text-[10px] text-slate-500 font-mono">C</kbd>
                  </button>

                  <button
                    onClick={() => {
                      onOpenCreateList();
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-slate-200 hover:text-white hover:bg-white/[0.06] text-left transition-colors cursor-pointer"
                  >
                    <List className="w-3.5 h-3.5 text-slate-400" />
                    <span>Create List</span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('calendar');
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-slate-200 hover:text-white hover:bg-white/[0.06] text-left transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Go to Calendar</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateSettings();
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-slate-200 hover:text-white hover:bg-white/[0.06] text-left transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Go to Settings</span>
                  </button>
                </div>
              </div>

              {/* Tasks */}
              {query && filteredTasks.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Tasks
                  </div>
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onClose()}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-slate-200 hover:bg-white/[0.06] cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2
                          className={`w-3 h-3 ${t.completed ? 'text-emerald-400' : 'text-slate-500'}`}
                        />
                        <span className={t.completed ? 'line-through text-slate-500' : ''}>
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-slate-500">
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Lists */}
              {query && filteredLists.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Lists
                  </div>
                  {filteredLists.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        setSelectedListId(l.id);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-slate-200 hover:bg-white/[0.06] cursor-pointer"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: l.color }}
                      />
                      <span>{l.name}</span>
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
