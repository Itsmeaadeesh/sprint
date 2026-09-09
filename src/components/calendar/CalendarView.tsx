import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
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
    <div className="flex-1 flex flex-col p-3 sm:p-6 overflow-hidden font-mono select-none">
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center editorial-border">
            <button
              onClick={prevWeek}
              className="p-1.5 text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextWeek}
              className="p-1.5 text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer border-l-2 border-[var(--line)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider editorial-border text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
          >
            Today
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
            {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} –{' '}
            {weekDays[6].toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-[var(--muted-3)] uppercase">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] inline-block" />
          <span>Drag tasks between days to reschedule</span>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 min-h-0 overflow-y-auto">
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
                'flex flex-col editorial-border-thick bg-[var(--card-bg)] p-3 min-h-[360px] relative transition-all',
                today && 'border-[var(--accent)]'
              )}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 mb-2 editorial-border-b">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                    {dayName}
                  </div>
                  <div
                    className={cn(
                      'text-xl font-heading font-bold mt-0.5',
                      today ? 'text-[var(--accent)]' : 'text-[var(--fg)]'
                    )}
                  >
                    {dayNumber}
                  </div>
                </div>

                <button
                  onClick={() => onQuickAddForDate(dayIso)}
                  title="Add task for this date"
                  className="p-1 editorial-border text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
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
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] -ml-1" />
                  <div className="flex-1 border-t-2 border-[var(--accent)]" />
                </div>
              )}

              {/* Task Cards for the Day */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {dayTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-3">
                    <span className="text-[10px] uppercase font-bold text-[var(--muted-3)]">No tasks</span>
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
                          'group p-2 editorial-border bg-[var(--bg)] hover:bg-[var(--hover-bg)] cursor-grab active:cursor-grabbing transition-all text-xs',
                          t.completed && 'opacity-50 line-through'
                        )}
                        style={{ borderLeft: `3px solid ${color}` }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-mono text-[var(--fg)] leading-snug">
                            {t.title}
                          </span>
                          <button
                            onClick={() => toggleTaskCompleted(t.id)}
                            className={cn('task-box', t.completed && 'done')}
                          />
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
