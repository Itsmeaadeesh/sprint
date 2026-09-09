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
    <div className="px-4 sm:px-6 pt-3 pb-1 border-b border-white/[0.05] bg-[#0b0c11]">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-6 overflow-x-auto text-xs">
          {/* Progress metric */}
          <div className="flex items-center gap-2">
            <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              {completionPct}% resolved
            </span>
          </div>

          <div className="w-px h-3 bg-white/10" />

          {/* Open Issues */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="font-mono font-medium text-slate-200">{openTasks.length}</span>
            <span className="text-[11px]">open</span>
          </div>

          {/* Due Today / Overdue */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-medium text-slate-200">{dueTodayTasks.length}</span>
            <span className="text-[11px]">today</span>
            {overdueTasks.length > 0 && (
              <span className="text-[10px] text-rose-400 font-mono ml-1">
                ({overdueTasks.length} overdue)
              </span>
            )}
          </div>

          {/* High Priority */}
          {highPriorityTasks.length > 0 && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono font-medium text-slate-200">{highPriorityTasks.length}</span>
              <span className="text-[11px]">urgent</span>
            </div>
          )}

          {/* Completed */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono font-medium text-slate-200">{completedTasks.length}</span>
            <span className="text-[11px]">completed</span>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-500 hover:text-slate-400 p-0.5 rounded text-xs transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
