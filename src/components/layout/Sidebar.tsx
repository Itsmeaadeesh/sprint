import React from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Layers,
  Settings,
  Calendar,
  FolderKanban,
} from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onCreateList: () => void;
  onNavigateSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onCreateList,
  onNavigateSettings,
}) => {
  const { lists, tasks, selectedListId, setSelectedListId, viewMode, setViewMode } = useBoard();

  const totalOpenTasks = tasks.filter((t) => !t.completed).length;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      <aside
        className={cn(
          'editorial-border-r-thick bg-[var(--bg)] flex flex-col justify-between transition-all duration-200 select-none font-mono',
          // Mobile: drawer positioning
          'fixed inset-y-0 left-0 z-40 md:static md:z-20',
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
        )}
      >
      {/* Top section */}
      <div className="p-3 space-y-4">
        {/* Toggle & Section Header */}
        <div className="flex items-center justify-between px-1 py-1.5 editorial-border-b">
          {isOpen ? (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </div>
          ) : <div />}
          <button
            onClick={onToggle}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="p-1 text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer editorial-border"
          >
            {isOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        </div>

        {/* System Views */}
        <div className="space-y-1">
          <button
            onClick={() => {
              setSelectedListId('all');
              setViewMode('board');
            }}
            className={cn(
              'flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer',
              selectedListId === 'all' && viewMode === 'board'
                ? 'bg-[var(--fg)] text-[var(--bg)]'
                : 'text-[var(--fg)] hover:bg-[var(--hover-bg)]'
            )}
            title="All Tasks"
          >
            <Layers className="w-3.5 h-3.5 flex-shrink-0" />
            {isOpen && (
              <>
                <span className="flex-1 text-left truncate">All Tasks</span>
                <span className="text-[11px] font-bold opacity-80">{totalOpenTasks}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              'flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer',
              viewMode === 'calendar'
                ? 'bg-[var(--fg)] text-[var(--bg)]'
                : 'text-[var(--fg)] hover:bg-[var(--hover-bg)]'
            )}
            title="Weekly Calendar"
          >
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            {isOpen && <span className="flex-1 text-left truncate">Calendar</span>}
          </button>
        </div>

        {/* User's Project Lists */}
        <div>
          <div className="flex items-center justify-between px-1 py-1 mb-1 editorial-border-b">
            {isOpen && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-3)]">
                Lists
              </span>
            )}
            <button
              onClick={onCreateList}
              title="Add new list"
              className="p-1 text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto">
            {lists.map((list) => {
              const count = tasks.filter((t) => t.list_id === list.id && !t.completed).length;
              const isSelected = selectedListId === list.id && viewMode === 'board';

              return (
                <button
                  key={list.id}
                  onClick={() => {
                    setSelectedListId(list.id);
                    setViewMode('board');
                  }}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors group cursor-pointer',
                    isSelected
                      ? 'bg-[var(--fg)] text-[var(--bg)]'
                      : 'text-[var(--fg)] hover:bg-[var(--hover-bg)]'
                  )}
                  title={list.name}
                >
                  <span
                    className="w-2.5 h-2.5 border border-current flex-shrink-0"
                    style={{ backgroundColor: list.color || 'var(--accent)' }}
                  />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left truncate">{list.name}</span>
                      <span className="text-[11px] opacity-80">
                        {count}
                      </span>
                    </>
                  )}
                </button>
              );
            })}

            {isOpen && lists.length === 0 && (
              <div className="px-2 py-4 text-center text-[10px] text-[var(--muted-3)] editorial-border uppercase">
                No lists created
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="p-3 editorial-border-t">
        <button
          onClick={onNavigateSettings}
          className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5 flex-shrink-0" />
          {isOpen && <span className="flex-1 text-left truncate">Settings</span>}
        </button>
      </div>
    </aside>
  </>
  );
};
