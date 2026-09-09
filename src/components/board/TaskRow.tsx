import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, Calendar, MoreHorizontal, ArrowRight, Check } from 'lucide-react';
import type { TaskItem } from '../../types';
import { useBoard } from '../../contexts/BoardContext';
import { formatDate, isOverdue, cn } from '../../lib/utils';

interface TaskRowProps {
  task: TaskItem;
  isDragging?: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, isDragging }) => {
  const { toggleTaskCompleted, toggleTaskStarred, deleteTask, lists, moveTask } = useBoard();
  const [showMenu, setShowMenu] = useState(false);

  const overdue = isOverdue(task.due_date);

  // Linear-style Priority Bars Icon
  const renderPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return (
          <div className="flex items-end gap-[1.5px] h-3 px-1" title="High priority">
            <span className="w-[2px] h-1.5 bg-rose-500 rounded-xs" />
            <span className="w-[2px] h-2.5 bg-rose-500 rounded-xs" />
            <span className="w-[2px] h-3.5 bg-rose-500 rounded-xs" />
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-end gap-[1.5px] h-3 px-1" title="Medium priority">
            <span className="w-[2px] h-1.5 bg-amber-500 rounded-xs" />
            <span className="w-[2px] h-2.5 bg-amber-500 rounded-xs" />
            <span className="w-[2px] h-1 bg-white/20 rounded-xs" />
          </div>
        );
      case 'low':
      default:
        return (
          <div className="flex items-end gap-[1.5px] h-3 px-1" title="Low priority">
            <span className="w-[2px] h-1.5 bg-blue-400 rounded-xs" />
            <span className="w-[2px] h-1 bg-white/20 rounded-xs" />
            <span className="w-[2px] h-1 bg-white/20 rounded-xs" />
          </div>
        );
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompleted(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'group relative flex flex-col p-2.5 rounded-lg border transition-all duration-150',
        task.completed
          ? 'bg-[#101218]/40 border-white/[0.04] opacity-50'
          : 'bg-[#13151f] hover:bg-[#181a26] border-white/[0.07] hover:border-white/[0.14] shadow-xs',
        isDragging && 'shadow-xl ring-1 ring-[#5e6ad2] bg-[#1a1c2a] z-40',
        'select-none'
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Crisp Linear Checkbox */}
        <button
          onClick={handleCheckboxClick}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          className={cn(
            'relative mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border transition-all flex items-center justify-center cursor-pointer',
            task.completed
              ? 'bg-[#5e6ad2] border-[#5e6ad2]'
              : 'border-white/30 hover:border-white/60 bg-transparent'
          )}
        >
          {task.completed && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
        </button>

        {/* Task Title & Details */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-xs font-normal leading-relaxed break-words transition-all',
              task.completed
                ? 'line-through text-slate-500'
                : 'text-slate-200 group-hover:text-white'
            )}
          >
            {task.title}
          </p>

          {task.description && !task.completed && (
            <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-normal">
              {task.description}
            </p>
          )}

          {/* Metadata Row: Priority icon + Due date */}
          <div className="flex items-center gap-2 mt-1.5">
            {renderPriorityIcon()}

            {task.due_date && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-mono',
                  overdue && !task.completed
                    ? 'text-rose-400'
                    : 'text-slate-400'
                )}
              >
                <Calendar className="w-2.5 h-2.5" />
                {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>

        {/* Hover Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskStarred(task.id);
            }}
            title={task.starred ? 'Starred' : 'Star'}
            className={cn(
              'p-1 rounded hover:bg-white/10 transition-colors cursor-pointer',
              task.starred ? 'text-amber-400 opacity-100' : 'text-slate-500 hover:text-amber-400'
            )}
          >
            <Star className={cn('w-3 h-3', task.starred && 'fill-amber-400')} />
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              title="Options"
              className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>

            {showMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-40 p-1 rounded-lg linear-surface text-xs z-50 shadow-xl"
              >
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-500">
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
                      className="flex items-center justify-between w-full px-2 py-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                    >
                      <span className="truncate">{l.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                <div className="my-1 border-t border-white/[0.06]" />
                <button
                  onClick={() => {
                    deleteTask(task.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-1.5 w-full px-2 py-1.5 rounded text-rose-400 hover:bg-rose-500/10 text-left transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
