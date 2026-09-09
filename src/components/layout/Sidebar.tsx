import React from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Layers,
  Settings,
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
  const { lists, tasks, selectedListId, setSelectedListId } = useBoard();

  const totalOpenTasks = tasks.filter((t) => !t.completed).length;

  return (
    <aside
      className={cn(
        'relative border-r border-white/10 glass-panel bg-[#0d0e11]/90 flex flex-col justify-between transition-all duration-300 z-20',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Top section: lists & filters */}
      <div className="p-3 space-y-4">
        {/* Toggle Collapse Button */}
        <div className="flex items-center justify-between px-1">
          {isOpen && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Workspace
            </span>
          )}
          <button
            onClick={onToggle}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* System Views */}
        <div className="space-y-1">
          <button
            onClick={() => setSelectedListId('all')}
            className={cn(
              'flex items-center gap-3 w-full p-2 rounded-xl text-xs font-medium transition-all cursor-pointer',
              selectedListId === 'all'
                ? 'bg-white/10 text-white shadow-sm border border-white/15'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            )}
            title="All Tasks"
          >
            <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
            {isOpen && (
              <>
                <span className="flex-1 text-left truncate">All Tasks</span>
                <span className="text-[11px] font-mono text-slate-400">{totalOpenTasks}</span>
              </>
            )}
          </button>
        </div>

        {/* User's Custom Lists */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            {isOpen && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Lists ({lists.length})
              </span>
            )}
            <button
              onClick={onCreateList}
              title="Add new list"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto">
            {lists.map((list) => {
              const count = tasks.filter((t) => t.list_id === list.id && !t.completed).length;
              const isSelected = selectedListId === list.id;

              return (
                <button
                  key={list.id}
                  onClick={() => setSelectedListId(list.id)}
                  className={cn(
                    'flex items-center gap-3 w-full p-2 rounded-xl text-xs font-medium transition-all group cursor-pointer',
                    isSelected
                      ? 'bg-white/10 text-white shadow-sm border border-white/15'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  )}
                  title={list.name}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: list.color || '#3b82f6' }}
                  />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left truncate">{list.name}</span>
                      <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300">
                        {count}
                      </span>
                    </>
                  )}
                </button>
              );
            })}

            {isOpen && lists.length === 0 && (
              <div className="p-3 text-center text-xs text-slate-500 border border-dashed border-white/5 rounded-xl">
                No lists yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section: Settings */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={onNavigateSettings}
          className="flex items-center gap-3 w-full p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {isOpen && <span className="flex-1 text-left truncate">Settings</span>}
        </button>
      </div>
    </aside>
  );
};
