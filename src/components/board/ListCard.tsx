import React, { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreHorizontal, Trash2, Palette, GripVertical, Check } from 'lucide-react';
import type { TaskList, TaskItem, TaskPriority } from '../../types';
import { useBoard } from '../../contexts/BoardContext';
import { TaskRow } from './TaskRow';
import { CompletedAccordion } from './CompletedAccordion';
import { LIST_COLORS, cn } from '../../lib/utils';

interface ListCardProps {
  list: TaskList;
  tasks: TaskItem[];
}

export const ListCard: React.FC<ListCardProps> = ({ list, tasks }) => {
  const { createTask, updateList, deleteList, showCompleted } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [isEditingName, setIsEditingName] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'List',
      list,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    await createTask({
      title: taskTitle.trim(),
      list_id: list.id,
      priority: taskPriority,
    });
    setTaskTitle('');
    setIsAdding(false);
  };

  const handleRenameList = async () => {
    if (listName.trim() && listName !== list.name) {
      await updateList(list.id, { name: listName.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'w-80 flex-shrink-0 flex flex-col editorial-border-thick bg-[var(--card-bg)] max-h-[calc(100vh-160px)] font-mono select-none',
        isDragging && 'opacity-60 border-[var(--accent)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 editorial-border-b bg-[var(--bg)]">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[var(--muted-3)] hover:text-[var(--fg)] p-0.5"
            title="Drag list"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          <span
            className="w-2.5 h-2.5 border border-current flex-shrink-0"
            style={{ backgroundColor: list.color || 'var(--accent)' }}
          />

          {isEditingName ? (
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              onBlur={handleRenameList}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameList()}
              autoFocus
              className="bg-transparent text-xs font-bold font-heading uppercase text-[var(--fg)] px-1 py-0.5 border-b-2 border-[var(--accent)] outline-none w-full"
            />
          ) : (
            <h3
              onDoubleClick={() => setIsEditingName(true)}
              className="text-xs font-bold font-heading uppercase tracking-tight text-[var(--fg)] truncate cursor-pointer"
              title="Double click to rename"
            >
              {list.name}
            </h3>
          )}

          <span className="text-[10px] font-bold text-[var(--muted-3)]">
            [{activeTasks.length}]
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
            title="Add task"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowListMenu(!showListMenu)}
              className="p-1 text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showListMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-44 p-1 editorial-card editorial-border-thick text-xs z-50 font-mono"
              >
                <button
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowListMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-[var(--fg)] hover:bg-[var(--hover-bg)] text-left font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5" />
                  Change color
                </button>
                <button
                  onClick={() => {
                    setIsEditingName(true);
                    setShowListMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-[var(--fg)] hover:bg-[var(--hover-bg)] text-left font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span className="font-bold text-xs">A</span>
                  Rename
                </button>
                <div className="my-1 editorial-border-t" />
                <button
                  onClick={() => {
                    deleteList(list.id);
                    setShowListMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-[var(--accent)] hover:bg-[var(--hover-bg)] text-left font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete list
                </button>
              </div>
            )}

            {showColorPicker && (
              <div className="absolute right-0 top-full mt-1 p-2 editorial-card editorial-border-thick z-50 flex gap-1.5">
                {LIST_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      updateList(list.id, { color: c.hex });
                      setShowColorPicker(false);
                    }}
                    className="w-5 h-5 border-2 border-current transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                  >
                    {list.color === c.hex && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task List container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext items={activeTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {activeTasks.length === 0 && !isAdding && (
            <div className="py-8 text-center text-[10px] text-[var(--muted-3)] uppercase tracking-wider">
              No tasks
            </div>
          )}
          {activeTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </SortableContext>

        {showCompleted && <CompletedAccordion completedTasks={completedTasks} />}
      </div>

      {/* Inline Quick Add */}
      {isAdding && (
        <div className="p-2 editorial-border-t bg-[var(--bg)]">
          <form onSubmit={handleQuickAdd} className="space-y-2">
            <input
              type="text"
              placeholder="Task title..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              autoFocus
              className="w-full px-2 py-1 text-xs editorial-input"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={cn(
                      'px-1.5 py-0.5 text-[10px] uppercase font-bold editorial-border cursor-pointer',
                      taskPriority === p
                        ? 'bg-[var(--fg)] text-[var(--bg)]'
                        : 'bg-transparent text-[var(--muted)] hover:bg-[var(--hover-bg)]'
                    )}
                  >
                    {p[0]}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setTaskTitle('');
                  }}
                  className="px-2 py-1 text-xs uppercase font-bold text-[var(--muted)] hover:text-[var(--fg)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!taskTitle.trim()}
                  className="editorial-btn-primary py-1 px-3 text-xs disabled:opacity-50 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
