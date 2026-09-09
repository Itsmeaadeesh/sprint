import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import { isDueToday, isOverdue } from '../../lib/utils';

interface DashboardWidgetsProps {
  onQuickAdd?: () => void;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ onQuickAdd: _onQuickAdd }) => {
  const { tasks } = useBoard();
  const [collapsed, setCollapsed] = useState(false);

  const totalTasks = tasks.length;
  const openTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const dueTodayTasks = openTasks.filter((t) => isDueToday(t.due_date));
  const overdueTasks = openTasks.filter((t) => isOverdue(t.due_date));
  const highPriorityTasks = openTasks.filter((t) => t.priority === 'high');

  const completionPct = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  if (totalTasks === 0) return null;

  return (
    <div className="px-3 sm:px-6 py-2 editorial-border-b bg-[var(--bg)] font-mono text-xs select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          {/* Progress metric */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-16 sm:w-20 bg-transparent editorial-border h-3 p-[1px]">
              <div
                className="bg-[var(--accent)] h-full transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--fg)] whitespace-nowrap">
              {completionPct}% resolved
            </span>
          </div>

          <div className="w-px h-3.5 bg-[var(--line)] flex-shrink-0" />

          {/* Open Issues */}
          <div className="flex items-center gap-1.5 text-[var(--muted)] flex-shrink-0">
            <span className="font-bold text-[var(--fg)]">{openTasks.length}</span>
            <span className="uppercase text-[10px] tracking-wider">open</span>
          </div>

          {/* Due Today / Overdue */}
          <div className="flex items-center gap-1.5 text-[var(--muted)] flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="font-bold text-[var(--fg)]">{dueTodayTasks.length}</span>
            <span className="uppercase text-[10px] tracking-wider">today</span>
            {overdueTasks.length > 0 && (
              <span className="text-[10px] text-[var(--accent)] font-bold ml-1 uppercase">
                [{overdueTasks.length} overdue]
              </span>
            )}
          </div>

          {/* High Priority */}
          {highPriorityTasks.length > 0 && (
            <div className="flex items-center gap-1.5 text-[var(--accent)]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="font-bold">{highPriorityTasks.length}</span>
              <span className="uppercase text-[10px] tracking-wider">urgent</span>
            </div>
          )}

          {/* Completed */}
          <div className="flex items-center gap-1.5 text-[var(--muted)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--fg)]" />
            <span className="font-bold text-[var(--fg)]">{completedTasks.length}</span>
            <span className="uppercase text-[10px] tracking-wider">completed</span>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[var(--muted-3)] hover:text-[var(--fg)] p-1 text-xs cursor-pointer editorial-border ml-2"
        >
          {collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
