import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, CheckCircle2, List, Calendar, Settings, Plus } from 'lucide-react';
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
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setAiAnswer(null);
    }
  }, [isOpen]);

  // Keyboard shortcut listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredLists = lists.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  // Simulated AI quick answer for productivity inquiries
  const handleAskAI = () => {
    if (!query.trim()) return;
    setIsAnswering(true);
    setTimeout(() => {
      const pendingCount = tasks.filter((t) => !t.completed).length;
      const completedCount = tasks.filter((t) => t.completed).length;
      const highPriority = tasks.filter((t) => !t.completed && t.priority === 'high');

      let response = `Based on your board: You have ${pendingCount} open tasks and ${completedCount} completed. `;
      if (highPriority.length > 0) {
        response += `Prioritize your ${highPriority.length} high-priority tasks: "${highPriority[0].title}".`;
      } else {
        response += `Great pace! Keep tackling your upcoming tasks in order of due dates.`;
      }
      setAiAnswer(response);
      setIsAnswering(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-xl rounded-2xl glass-card border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Ask AI or search tasks, lists, commands..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setAiAnswer(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskAI();
                }}
                autoFocus
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <button
                onClick={handleAskAI}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Ask AI
              </button>
            </div>

            {/* AI Answer Box if triggered */}
            {aiAnswer && (
              <div className="p-3.5 bg-blue-500/10 border-b border-blue-500/20 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200 leading-relaxed">{aiAnswer}</p>
              </div>
            )}

            {isAnswering && (
              <div className="p-3.5 border-b border-white/10 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                Analyzing workspace...
              </div>
            )}

            {/* Command & Search Results */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-3">
              {/* Quick Actions */}
              <div>
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Quick Actions
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      onOpenQuickAdd();
                      onClose();
                    }}
                    className="flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5 text-blue-400" />
                      <span>Create new task</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 text-[10px] bg-white/5 border border-white/10 rounded font-mono text-slate-400">
                      N
                    </kbd>
                  </button>

                  <button
                    onClick={() => {
                      onOpenCreateList();
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <List className="w-3.5 h-3.5 text-violet-400" />
                    <span>Create new list</span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('calendar');
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Switch to Calendar View</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateSettings();
                      onClose();
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings & Preferences</span>
                  </button>
                </div>
              </div>

              {/* Matching Tasks */}
              {query && filteredTasks.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Tasks
                  </div>
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onClose()}
                      className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-white/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${t.completed ? 'text-emerald-400' : 'text-slate-500'}`}
                        />
                        <span className={t.completed ? 'line-through text-slate-500' : ''}>
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Matching Lists */}
              {query && filteredLists.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Lists
                  </div>
                  {filteredLists.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        setSelectedListId(l.id);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-white/10 cursor-pointer"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: l.color }}
                      />
                      <span>{l.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-white/[0.01] text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span>Select ↵</span>
                <span>Navigate ↑↓</span>
                <span>Close Esc</span>
              </div>
              <span>Sprint AI Assistant</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
