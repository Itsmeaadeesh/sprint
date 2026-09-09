import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import type { TaskItem } from '../../types';
import { cn } from '../../lib/utils';

export const CalendarView: React.FC<{ onQuickAddForDate: (dateStr: string) => void }> = ({ onQuickAddForDate }) => {
  const { tasks, lists, toggleTaskCompleted, updateTask } = useBoard();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(0);

  // Calculate live current time position
  useEffect(() => {
    const updateNow = () => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
    };
    updateNow();
    const interval = setInterval(updateNow, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get week days (Monday - Sunday)
  const getWeekDays = (baseDate: Date) => {
    const startOfWeek = new Date(baseDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Group tasks by date
  const getTasksForDate = (date: Date): TaskItem[] => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter((t) => {
      if (!t.due_date) return false;
      return t.due_date.startsWith(dateStr);
    });
  };

  const getListColor = (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    return list?.color || '#3b82f6';
  };

  // Drag and drop reschedule
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDrop = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const dateIso = targetDate.toISOString();
    await updateTask(taskId, { due_date: dateIso });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={prevWeek}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextWeek}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors cursor-pointer"
          >
            Today
          </button>

          <span className="text-sm font-semibold text-slate-200">
            {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} –{' '}
            {weekDays[6].toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          <span>Drag cards between days to reschedule</span>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-7 gap-3 min-h-0 overflow-y-auto">
        {weekDays.map((day, idx) => {
          const dayTasks = getTasksForDate(day);
          const today = isToday(day);
          const dayName = day.toLocaleDateString(undefined, { weekday: 'short' });
          const dayNumber = day.getDate();
          const dayIso = day.toISOString().split('T')[0];

          return (
            <div
              key={idx}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
              className={cn(
                'flex flex-col rounded-2xl glass-card border border-white/10 p-3 min-h-[360px] relative transition-all',
                today && 'ring-1 ring-blue-500/40 bg-blue-500/[0.02]'
              )}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {dayName}
                  </div>
                  <div
                    className={cn(
                      'text-lg font-bold mt-0.5',
                      today ? 'text-blue-400' : 'text-slate-200'
                    )}
                  >
                    {dayNumber}
                  </div>
                </div>

                <button
                  onClick={() => onQuickAddForDate(dayIso)}
                  title="Add task for this date"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Current Time Indicator on Today's column */}
              {today && (
                <div
                  className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                  style={{
                    top: `${Math.min(Math.max((currentTimeMinutes / 1440) * 100, 15), 90)}%`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80 -ml-1" />
                  <div className="flex-1 border-t border-rose-500/80 shadow-xs" />
                </div>
              )}

              {/* Task Cards for the Day */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {dayTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-4">
                    <span className="text-[11px] text-slate-600">No tasks</span>
                  </div>
                ) : (
                  dayTasks.map((t) => {
                    const color = getListColor(t.list_id);
                    return (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, t.id)}
                        className={cn(
                          'group p-2.5 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 cursor-grab active:cursor-grabbing transition-all shadow-sm',
                          t.completed && 'opacity-50 line-through'
                        )}
                        style={{ borderLeft: `3px solid ${color}` }}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-xs font-medium text-slate-200 leading-tight">
                            {t.title}
                          </span>
                          <button
                            onClick={() => toggleTaskCompleted(t.id)}
                            className="text-slate-500 hover:text-emerald-400 p-0.5 rounded transition-colors cursor-pointer"
                          >
                            <CheckCircle2
                              className={cn('w-3.5 h-3.5', t.completed && 'text-emerald-400')}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
