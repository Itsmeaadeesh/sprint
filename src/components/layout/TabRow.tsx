import React from 'react';
import { LayoutGrid, Calendar as CalendarIcon, Filter, Plus, Check } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import type { TaskPriority } from '../../types';
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
    filterPriority,
    setFilterPriority,
  } = useBoard();

  const [showPriorityMenu, setShowPriorityMenu] = React.useState(false);

  return (
    <div className="border-b border-white/[0.07] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 bg-[#0a0b0f]">
      {/* Left: Tab list */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setSelectedListId('all')}
          className={cn(
            'flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer',
            selectedListId === 'all'
              ? 'bg-white/[0.1] text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          )}
        >
          <span>All</span>
          <span className="text-[10px] font-mono text-slate-500">
            {tasks.filter((t) => !t.completed).length}
          </span>
        </button>

        {lists.map((l) => {
          const count = tasks.filter((t) => t.list_id === l.id && !t.completed).length;
          const isSelected = selectedListId === l.id;

          return (
            <button
              key={l.id}
              onClick={() => setSelectedListId(l.id)}
              className={cn(
                'flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer',
                isSelected
                  ? 'bg-white/[0.1] text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              )}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: l.color || '#5e6ad2' }}
              />
              <span className="truncate max-w-[130px]">{l.name}</span>
              <span className="text-[10px] font-mono text-slate-500">{count}</span>
            </button>
          );
        })}

        <button
          onClick={onCreateList}
          title="New list"
          className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors cursor-pointer ml-1"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Filters, Completed Toggle, View Switch */}
      <div className="flex items-center gap-2.5">
        {/* Priority Filter */}
        <div className="relative">
          <button
            onClick={() => setShowPriorityMenu(!showPriorityMenu)}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors cursor-pointer border',
              filterPriority !== 'all'
                ? 'bg-[#5e6ad2]/15 border-[#5e6ad2]/30 text-indigo-300'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200'
            )}
          >
            <Filter className="w-3 h-3" />
            <span className="capitalize">{filterPriority === 'all' ? 'Priority' : filterPriority}</span>
          </button>

          {showPriorityMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1.5 w-36 p-1 rounded-lg linear-surface text-xs z-50 shadow-xl"
            >
              {(['all', 'high', 'medium', 'low'] as (TaskPriority | 'all')[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setFilterPriority(p);
                    setShowPriorityMenu(false);
                  }}
                  className="flex items-center justify-between w-full px-2 py-1.5 rounded text-left capitalize text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <span>{p}</span>
                  {filterPriority === p && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Show Completed Toggle */}
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={cn(
            'px-2 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer',
            showCompleted
              ? 'bg-white/[0.04] border-white/[0.08] text-slate-300'
              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
          )}
        >
          {showCompleted ? 'Completed visible' : 'Completed hidden'}
        </button>

        <div className="w-px h-3.5 bg-white/10" />

        {/* View Mode Switcher */}
        <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-md p-0.5">
          <button
            onClick={() => setViewMode('board')}
            title="Board view"
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
              viewMode === 'board'
                ? 'bg-white/[0.12] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <LayoutGrid className="w-3 h-3" />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            title="Calendar view"
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
              viewMode === 'calendar'
                ? 'bg-white/[0.12] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <CalendarIcon className="w-3 h-3" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
