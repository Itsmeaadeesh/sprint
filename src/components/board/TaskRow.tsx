import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, Calendar, MoreHorizontal, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { TaskItem } from '../../types';
import { useBoard } from '../../contexts/BoardContext';
import { formatDate, isOverdue, getPriorityStyles, cn } from '../../lib/utils';

interface TaskRowProps {
  task: TaskItem;
  isDragging?: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, isDragging }) => {
  const { toggleTaskCompleted, toggleTaskStarred, deleteTask, lists, moveTask } = useBoard();
  const [showMenu, setShowMenu] = useState(false);

  const priorityStyle = getPriorityStyles(task.priority);
  const overdue = isOverdue(task.due_date);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981'],
          disableForReducedMotion: true,
        });
      } catch {
        // Safe fallback
      }
    }
    toggleTaskCompleted(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative flex flex-col p-3 rounded-xl border transition-all duration-200',
        task.completed
          ? 'bg-white/[0.015] border-white/5 opacity-60'
          : 'bg-white/[0.035] hover:bg-white/[0.06] border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5',
        isDragging && 'shadow-2xl ring-2 ring-blue-500/50 rotate-1 scale-[1.02] z-40',
        'glass-card'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Animated Circular Checkbox */}
        <button
          onClick={handleComplete}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          className={cn(
            'relative mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border transition-colors flex items-center justify-center cursor-pointer',
            task.completed
              ? 'bg-gradient-to-r from-blue-500 to-violet-600 border-transparent shadow-sm shadow-blue-500/30'
              : 'border-white/30 hover:border-blue-400 bg-white/5'
          )}
        >
          {task.completed && (
            <svg
              className="w-3.5 h-3.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M4 12l5 5L20 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </svg>
          )}
        </button>

        {/* Task Title & Description */}
        <div className="flex-1 min-w-0 pr-1">
          <p
            className={cn(
              'text-sm font-medium leading-snug break-words transition-all',
              task.completed
                ? 'line-through text-slate-500 dark:text-slate-500'
                : 'text-slate-200 hover:text-white'
            )}
          >
            {task.title}
          </p>
          {task.description && !task.completed && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Badges: Priority + Due Date */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* Priority Pill */}
            <span
              className={cn(
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border uppercase tracking-wider',
                priorityStyle.badge
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', priorityStyle.dot)} />
              {priorityStyle.label}
            </span>

            {/* Due Date Chip */}
            {task.due_date && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border',
                  overdue && !task.completed
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    : 'text-slate-400 bg-white/5 border-white/10'
                )}
              >
                <Calendar className="w-3 h-3" />
                {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>

        {/* Hover Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Star Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskStarred(task.id);
            }}
            title={task.starred ? 'Unstar task' : 'Star task'}
            className={cn(
              'p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer',
              task.starred ? 'text-amber-400 opacity-100' : 'text-slate-400 hover:text-amber-400'
            )}
          >
            <Star className={cn('w-3.5 h-3.5', task.starred && 'fill-amber-400')} />
          </button>

          {/* Move to another list */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              title="Task options"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-44 p-1 rounded-xl bg-[#1a1c23] border border-white/10 shadow-2xl z-50 text-xs backdrop-blur-xl"
              >
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Move to list
                </div>
                {lists
                  .filter((l) => l.id !== task.list_id)
                  .map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        moveTask(task.id, l.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                    >
                      <span className="truncate">{l.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                <div className="my-1 border-t border-white/10" />
                <button
                  onClick={() => {
                    deleteTask(task.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-left transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
