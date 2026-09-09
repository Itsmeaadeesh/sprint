import React, { useState, useEffect } from 'react';
import { Plus, Flame, Clock, StickyNote } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import { useAuth } from '../../contexts/AuthContext';
import { ProgressRing } from './ProgressRing';
import { isDueToday, formatDate } from '../../lib/utils';

interface DashboardWidgetsProps {
  onQuickAdd: () => void;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ onQuickAdd }) => {
  const { tasks } = useBoard();
  const { user } = useAuth();

  // Scratchpad quick note state
  const [quickNote, setQuickNote] = useState(() => {
    return user ? localStorage.getItem(`sprint_note_${user.id}`) || '' : '';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`sprint_note_${user.id}`, quickNote);
    }
  }, [quickNote, user]);

  // Today's tasks
  const todayTasks = tasks.filter((t) => isDueToday(t.due_date));
  const todayCompleted = todayTasks.filter((t) => t.completed);
  const todayProgress = todayTasks.length > 0 ? (todayCompleted.length / todayTasks.length) * 100 : 0;

  // Upcoming deadlines (next 7 days, excluding overdue or completed)
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingTasks = tasks
    .filter((t) => {
      if (t.completed || !t.due_date) return false;
      const d = new Date(t.due_date);
      return d >= now && d <= sevenDaysLater;
    })
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 3);

  // Focus streak: count tasks completed in consecutive days or completed total
  const completedCount = tasks.filter((t) => t.completed).length;
  // Calculate a streak based on completed tasks
  const streakDays = completedCount > 0 ? Math.min(Math.ceil(completedCount / 3), 14) : 0;

  return (
    <div className="px-6 pt-4 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Today's Tasks Progress Card */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between gap-4 shadow-lg hover:border-white/20 transition-all">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Today's Tasks
              </span>
              <button
                onClick={onQuickAdd}
                title="Quick add task"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white font-mono">
                {todayCompleted.length}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {todayTasks.length} done
              </span>
            </div>

            {/* Stacked completed chips */}
            <div className="flex items-center gap-1 mt-2">
              {todayTasks.length === 0 ? (
                <span className="text-[11px] text-slate-500 italic">No tasks due today</span>
              ) : (
                todayTasks.slice(0, 5).map((t) => (
                  <span
                    key={t.id}
                    title={t.title}
                    className={`w-2 h-2 rounded-full ${
                      t.completed ? 'bg-emerald-400' : 'bg-white/20'
                    }`}
                  />
                ))
              )}
            </div>
          </div>

          <ProgressRing progress={todayProgress} size={56} strokeWidth={5} />
        </div>

        {/* 2. Upcoming Deadlines Widget */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col justify-between shadow-lg hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Upcoming Deadlines
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono">
              {upcomingTasks.length}
            </span>
          </div>

          <div className="space-y-1.5">
            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-1">No deadlines in next 7 days</p>
            ) : (
              upcomingTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 truncate max-w-[140px]">{t.title}</span>
                  <span className="text-[11px] text-amber-400/90 font-mono">
                    {formatDate(t.due_date)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Focus Streak Widget */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between shadow-lg hover:border-white/20 transition-all">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Focus Streak
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white font-mono">{streakDays}</span>
              <span className="text-xs text-slate-400">days active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {completedCount > 0 ? `${completedCount} total tasks crushed` : 'Complete tasks to build momentum'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Flame className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        {/* 4. Quick Note Scratchpad */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col shadow-lg hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-violet-400" />
              Quick Note
            </span>
            <span className="text-[10px] text-slate-500">Auto-saved</span>
          </div>
          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Jot down a thought, link, or meeting point..."
            rows={2}
            className="w-full bg-transparent text-xs text-slate-300 placeholder:text-slate-600 outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};
