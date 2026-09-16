import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import type { TaskItem } from '../../types';
import { cn } from '../../lib/utils';

export const CalendarView: React.FC<{ onQuickAddForDate: (dateStr: string) => void }> = ({ onQuickAddForDate }) => {
  const { tasks, lists, toggleTaskCompleted, updateTask } = useBoard();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

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

  // Sync selected day index to today if inside current week
  useEffect(() => {
    const todayIndex = weekDays.findIndex(isToday);
    if (todayIndex !== -1) {
      setSelectedDayIndex(todayIndex);
    }
  }, [currentDate]);

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
              aria-label="Previous week"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextWeek}
              aria-label="Next week"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer border-l-2 border-[var(--line)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="min-h-[40px] px-3 py-2 text-xs font-bold uppercase tracking-wider editorial-border text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer flex items-center justify-center"
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

      {/* Mobile-Only Day Selector Ribbon & Agenda View */}
      <div className="md:hidden flex-1 flex flex-col min-h-0 overflow-hidden space-y-3">
        {/* 7-day horizontal tap ribbon */}
        <div className="grid grid-cols-7 gap-1.5 p-1 editorial-border bg-[var(--card-bg)]">
          {weekDays.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            const isCurrentDay = isToday(day);
            const count = getTasksForDate(day).length;
            const dayLetter = day.toLocaleDateString(undefined, { weekday: 'narrow' });
            const dayNum = day.getDate();

            return (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={cn(
                  'flex flex-col items-center justify-center py-2.5 px-1 min-h-[52px] transition-all cursor-pointer relative',
                  isSelected
                    ? 'bg-[var(--fg)] text-[var(--bg)] font-bold'
                    : 'text-[var(--fg)] hover:bg-[var(--hover-bg)]',
                  isCurrentDay && !isSelected && 'text-[var(--accent)]'
                )}
              >
                <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">{dayLetter}</span>
                <span className="text-sm font-heading font-bold mt-0.5">{dayNum}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full mt-1',
                      isSelected ? 'bg-[var(--bg)]' : 'bg-[var(--accent)]'
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Agenda Card */}
        {(() => {
          const activeDay = weekDays[selectedDayIndex] || weekDays[0];
          const activeTasks = getTasksForDate(activeDay);
          const activeIso = activeDay.toISOString().split('T')[0];
          const isCurrentDay = isToday(activeDay);

          return (
            <div className="flex-1 flex flex-col editorial-border-thick bg-[var(--card-bg)] p-3.5 sm:p-4 min-h-0 overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 editorial-border-b">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                    {isCurrentDay ? 'Today' : activeDay.toLocaleDateString(undefined, { weekday: 'long' })}
                  </div>
                  <div className="text-lg font-heading font-bold text-[var(--fg)] mt-0.5">
                    {activeDay.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <button
                  onClick={() => onQuickAddForDate(activeIso)}
                  className="min-h-[40px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider editorial-border bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Task list for selected day */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                {activeTasks.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-[var(--line)]">
                    <span className="text-xs uppercase font-bold text-[var(--muted)] mb-2">No tasks scheduled</span>
                    <button
                      onClick={() => onQuickAddForDate(activeIso)}
                      className="min-h-[40px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider editorial-border text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                    >
                      + Schedule for this day
                    </button>
                  </div>
                ) : (
                  activeTasks.map((t) => {
                    const color = getListColor(t.list_id);
                    return (
                      <div
                        key={t.id}
                        className={cn(
                          'p-3 editorial-border bg-[var(--bg)] flex items-center justify-between gap-3 text-xs transition-all min-h-[44px]',
                          t.completed && 'opacity-50 line-through'
                        )}
                        style={{ borderLeft: `4px solid ${color}` }}
                      >
                        <span className="text-sm font-mono text-[var(--fg)] leading-snug flex-1">
                          {t.title}
                        </span>
                        <div className="w-10 h-10 -m-2 flex items-center justify-center shrink-0">
                          <button
                            onClick={() => toggleTaskCompleted(t.id)}
                            aria-label={`Mark task ${t.completed ? 'incomplete' : 'complete'}`}
                            className={cn('task-box cursor-pointer', t.completed && 'done')}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Desktop 7-Day Grid (Hidden on Mobile) */}
      <div className="hidden md:grid flex-1 grid-cols-7 gap-3 min-h-0 overflow-y-auto">
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
                  className="p-1.5 editorial-border text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
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
