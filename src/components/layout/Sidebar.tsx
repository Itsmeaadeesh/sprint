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

  const handleItemClick = (action: () => void) => {
    action();
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

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
          'pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+0.75rem)]',
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
            aria-label="Toggle sidebar"
            className="p-2 text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer editorial-border min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* System Views */}
        <div className="space-y-1">
          <button
            onClick={() => handleItemClick(() => {
              setSelectedListId('all');
              setViewMode('board');
            })}
            className={cn(
              'flex items-center gap-2.5 w-full px-2.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[44px]',
              selectedListId === 'all' && viewMode === 'board'
                ? 'bg-[var(--fg)] text-[var(--bg)]'
                : 'text-[var(--fg)] hover:bg-[var(--hover-bg)]'
            )}
            title="All Tasks"
          >
            <Layers className="w-4 h-4 flex-shrink-0" />
            {isOpen && (
              <>
                <span className="flex-1 text-left truncate">All Tasks</span>
                <span className="text-[11px] font-bold opacity-80">{totalOpenTasks}</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleItemClick(() => setViewMode('calendar'))}
            className={cn(
              'flex items-center gap-2.5 w-full px-2.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[44px]',
              viewMode === 'calendar'
                ? 'bg-[var(--fg)] text-[var(--bg)]'
                : 'text-[var(--fg)] hover:bg-[var(--hover-bg)]'
            )}
            title="Weekly Calendar"
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
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
              aria-label="Add new list"
              className="p-1.5 text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto">
            {lists.map((list) => {
              const count = tasks.filter((t) => t.list_id === list.id && !t.completed).length;
              const isSelected = selectedListId === list.id && viewMode === 'board';

              return (
                <button
                  key={list.id}
                  onClick={() => handleItemClick(() => {
                    setSelectedListId(list.id);
                    setViewMode('board');
                  })}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-2.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors group cursor-pointer min-h-[44px]',
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
          onClick={() => handleItemClick(onNavigateSettings)}
          className="flex items-center gap-2.5 w-full px-2.5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer min-h-[44px]"
          title="Settings"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {isOpen && <span className="flex-1 text-left truncate">Settings</span>}
        </button>
      </div>
    </aside>
  </>
  );
};
