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
  const priorityMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (priorityMenuRef.current && !priorityMenuRef.current.contains(e.target as Node)) {
        setShowPriorityMenu(false);
      }
    };
    if (showPriorityMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showPriorityMenu]);

  return (
    <div className="editorial-border-b-thick px-2.5 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 bg-[var(--bg)] font-mono select-none w-full overflow-hidden">
      {/* Left: Tab list */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full touch-pan-x">
        <button
          onClick={() => setSelectedListId('all')}
          className={cn(
            'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer editorial-border min-h-[36px]',
            selectedListId === 'all'
              ? 'bg-[var(--fg)] text-[var(--bg)]'
              : 'bg-transparent text-[var(--fg)] hover:bg-[var(--hover-bg)]'
          )}
        >
          <span>All</span>
          <span className="text-[10px] opacity-80">
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
                'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer editorial-border min-h-[36px]',
                isSelected
                  ? 'bg-[var(--fg)] text-[var(--bg)]'
                  : 'bg-transparent text-[var(--fg)] hover:bg-[var(--hover-bg)]'
              )}
            >
              <span
                className="w-2 h-2 border border-current flex-shrink-0"
                style={{ backgroundColor: l.color || 'var(--accent)' }}
              />
              <span className="truncate max-w-[80px] sm:max-w-[130px]">{l.name}</span>
              <span className="text-[10px] opacity-80">{count}</span>
            </button>
          );
        })}

        <button
          onClick={onCreateList}
          title="New list"
          aria-label="New list"
          className="p-2 editorial-border text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer ml-0.5 min-w-[36px] min-h-[36px] flex items-center justify-center flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Filters, Completed Toggle, View Switch */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
        {/* Priority Filter */}
        <div ref={priorityMenuRef} className="relative">
          <button
            onClick={() => setShowPriorityMenu(!showPriorityMenu)}
            aria-label="Filter by priority"
            className={cn(
              'flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer editorial-border min-h-[36px]',
              filterPriority !== 'all'
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-transparent text-[var(--fg)] hover:bg-[var(--hover-bg)]'
            )}
          >
            <Filter className="w-3 h-3" />
            <span className="capitalize">{filterPriority === 'all' ? 'Priority' : filterPriority}</span>
          </button>

          {showPriorityMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1.5 w-40 p-1 editorial-card editorial-border-thick text-xs z-50 font-mono shadow-2xl"
            >
              {(['all', 'high', 'medium', 'low'] as (TaskPriority | 'all')[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setFilterPriority(p);
                    setShowPriorityMenu(false);
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-2 text-left capitalize font-bold text-[11px] uppercase tracking-wider text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                >
                  <span>{p}</span>
                  {filterPriority === p && <Check className="w-3 h-3 text-[var(--accent)]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Show Completed Toggle */}
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={cn(
            'px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider editorial-border transition-colors cursor-pointer whitespace-nowrap min-h-[36px]',
            showCompleted
              ? 'bg-[var(--fg)] text-[var(--bg)]'
              : 'bg-transparent text-[var(--muted)] hover:bg-[var(--hover-bg)]'
          )}
        >
          {showCompleted ? 'Done: ON' : 'Done: OFF'}
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center editorial-border min-h-[36px]">
          <button
            onClick={() => setViewMode('board')}
            title="Board view"
            aria-label="Switch to board view"
            className={cn(
              'flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[34px]',
              viewMode === 'board'
                ? 'bg-[var(--fg)] text-[var(--bg)]'
                : 'bg-transparent text-[var(--fg)] hover:bg-[var(--hover-bg)]'
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            title="Calendar view"
            aria-label="Switch to calendar view"
            className={cn(
              'flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-l-2 border-[var(--line)] min-h-[34px]',
              viewMode === 'calendar'
                ? 'bg-[var(--fg)] text-[var(--bg)]'
                : 'bg-transparent text-[var(--fg)] hover:bg-[var(--hover-bg)]'
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
