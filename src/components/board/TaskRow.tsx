import React, { useState } from 'react';
import { Star, Trash2, Calendar, MoreHorizontal, ArrowRight } from 'lucide-react';
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
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showMenu]);

  const overdue = isOverdue(task.due_date);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompleted(task.id);
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col p-2.5 editorial-border bg-[var(--card-bg)] transition-all font-mono select-none text-xs',
        task.completed
          ? 'opacity-60 bg-[var(--bg)]'
          : 'hover:bg-[var(--hover-bg)]',
        isDragging && 'border-[var(--accent)] bg-[var(--hover-bg)] z-40'
      )}
    >
      <div className="flex items-start gap-2">
        {/* Exact Brutalist .task-box with accessible 40px touch padding */}
        <button
          onClick={handleCheckboxClick}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          type="button"
          className="w-10 h-10 -m-2 flex items-center justify-center cursor-pointer flex-shrink-0"
        >
          <span
            className={cn(
              'task-box',
              task.completed && 'done'
            )}
          />
        </button>

        {/* Task Title & Details */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p
            className={cn(
              'text-xs leading-relaxed break-words font-mono',
              task.completed
                ? 'line-through text-[var(--gray-soft)]'
                : 'text-[var(--fg)] font-medium'
            )}
          >
            {task.title}
          </p>

          {task.description && !task.completed && (
            <p className="mt-1 text-[11px] text-[var(--muted)] line-clamp-2 leading-normal">
              {task.description}
            </p>
          )}

          {/* Metadata Row: Priority badge + Due date */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                'task-tag',
                task.priority === 'high' && 'border-[var(--accent)] text-[var(--accent)]',
                task.priority === 'medium' && 'text-[var(--muted-2)]',
                task.priority === 'low' && 'text-[var(--muted-3)]'
              )}
            >
              {task.priority}
            </span>

            {task.due_date && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-mono uppercase',
                  overdue && !task.completed
                    ? 'text-[var(--accent)] font-bold'
                    : 'text-[var(--muted-3)]'
                )}
              >
                <Calendar className="w-2.5 h-2.5" />
                {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div ref={menuRef} className="flex items-center gap-1 flex-shrink-0 pt-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskStarred(task.id);
            }}
            title={task.starred ? 'Starred' : 'Star'}
            aria-label={task.starred ? 'Unstar task' : 'Star task'}
            className={cn(
              'w-8 h-8 flex items-center justify-center transition-colors cursor-pointer',
              task.starred ? 'text-[var(--accent)]' : 'text-[var(--muted-3)] hover:text-[var(--fg)]'
            )}
          >
            <Star className={cn('w-3.5 h-3.5', task.starred && 'fill-current')} />
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              title="Options"
              aria-label="Task options"
              className="w-8 h-8 flex items-center justify-center text-[var(--muted-3)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-44 p-1 editorial-card editorial-border-thick text-xs z-50 font-mono shadow-2xl"
              >
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-[var(--muted-3)] tracking-wider">
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
                      className="flex items-center justify-between w-full px-2.5 py-2 text-[var(--fg)] hover:bg-[var(--hover-bg)] text-left font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span className="truncate">{l.name}</span>
                      <ArrowRight className="w-3 h-3 text-[var(--muted-3)] flex-shrink-0" />
                    </button>
                  ))}
                <div className="my-1 editorial-border-t" />
                <button
                  onClick={() => {
                    deleteTask(task.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-2 text-[var(--accent)] hover:bg-[var(--hover-bg)] text-left font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
