import React from 'react';
import { LayoutGrid, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import { cn } from '../../lib/utils';

interface TabRowProps {
  onCreateList: () => void;
}

export const TabRow: React.FC<TabRowProps> = ({ onCreateList }) => {
  const {
    lists,
    tasks,
    selectedListId,
    setSelectedListId,
    viewMode,
    setViewMode,
    showCompleted,
    setShowCompleted,
  } = useBoard();

  return (
    <div className="border-b border-white/10 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 bg-[#0d0e11]/50 backdrop-blur-md">
      {/* Left: Tab List ("All tasks" + user-created lists) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {/* All tasks tab */}
        <button
          onClick={() => setSelectedListId('all')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer',
            selectedListId === 'all'
              ? 'bg-white/10 text-white shadow-sm border border-white/15'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          )}
        >
          <span>All Tasks</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-mono">
            {tasks.filter((t) => !t.completed).length}
          </span>
        </button>

        {/* User-created lists */}
        {lists.map((l) => {
          const listTaskCount = tasks.filter((t) => t.list_id === l.id && !t.completed).length;
          const isSelected = selectedListId === l.id;

          return (
            <button
              key={l.id}
              onClick={() => setSelectedListId(l.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer',
                isSelected
                  ? 'bg-white/10 text-white shadow-sm border border-white/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              )}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: l.color || '#3b82f6' }}
              />
              <span className="truncate max-w-[120px]">{l.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-400 font-mono">
                {listTaskCount}
              </span>
            </button>
          );
        })}

        {/* New List button in tab row */}
        <button
          onClick={onCreateList}
          title="Create new list"
          className="p-1.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: "Show Done" toggle + View Switcher (Board vs Calendar) */}
      <div className="flex items-center gap-3">
        {/* Show Done toggle */}
        <label className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="sr-only"
          />
          <div
            className={cn(
              'w-7 h-4 rounded-full transition-colors relative p-0.5',
              showCompleted ? 'bg-blue-600' : 'bg-white/10'
            )}
          >
            <div
              className={cn(
                'w-3 h-3 rounded-full bg-white transition-transform',
                showCompleted ? 'translate-x-3' : 'translate-x-0'
              )}
            />
          </div>
          <span className="hidden sm:inline">Show done</span>
        </label>

        <div className="w-px h-4 bg-white/10" />

        {/* View Mode Switcher */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('board')}
            title="Board view"
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              viewMode === 'board'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            title="Calendar view"
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              viewMode === 'calendar'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
