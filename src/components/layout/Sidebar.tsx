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
    <aside
      className={cn(
        'relative border-r border-white/[0.07] bg-[#0a0b10] flex flex-col justify-between transition-all duration-200 z-20 select-none',
        isOpen ? 'w-56' : 'w-14'
      )}
    >
      {/* Top section */}
      <div className="p-2 space-y-4">
        {/* Toggle & Section Header */}
        <div className="flex items-center justify-between px-2 py-1.5">
          {isOpen ? (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </div>
          ) : <div />}
          <button
            onClick={onToggle}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* System Views */}
        <div className="space-y-0.5">
          <button
            onClick={() => {
              setSelectedListId('all');
              setViewMode('board');
            }}
            className={cn(
              'flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              selectedListId === 'all' && viewMode === 'board'
                ? 'bg-white/[0.08] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            )}
            title="All Tasks"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {isOpen && (
              <>
                <span className="flex-1 text-left truncate">All Tasks</span>
                <span className="text-[11px] font-mono text-slate-500">{totalOpenTasks}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              'flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              viewMode === 'calendar'
                ? 'bg-white/[0.08] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            )}
            title="Weekly Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {isOpen && <span className="flex-1 text-left truncate">Calendar</span>}
          </button>
        </div>

        {/* User's Project Lists */}
        <div>
          <div className="flex items-center justify-between px-2.5 py-1 mb-0.5">
            {isOpen && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Lists
              </span>
            )}
            <button
              onClick={onCreateList}
              title="Add new list"
              className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-0.5 max-h-[calc(100vh-300px)] overflow-y-auto">
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
                    'flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors group cursor-pointer',
                    isSelected
                      ? 'bg-white/[0.08] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  )}
                  title={list.name}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: list.color || '#5e6ad2' }}
                  />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left truncate">{list.name}</span>
                      <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-400">
                        {count}
                      </span>
                    </>
                  )}
                </button>
              );
            })}

            {isOpen && lists.length === 0 && (
              <div className="px-2.5 py-4 text-center text-[11px] text-slate-600 border border-dashed border-white/[0.06] rounded-lg">
                No lists created
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="p-2 border-t border-white/[0.06]">
        <button
          onClick={onNavigateSettings}
          className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5 flex-shrink-0" />
          {isOpen && <span className="flex-1 text-left truncate">Settings</span>}
        </button>
      </div>
    </aside>
  );
};
