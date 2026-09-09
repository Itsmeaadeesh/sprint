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
        'w-76 flex-shrink-0 flex flex-col rounded-xl bg-[#0d0e14] border border-white/[0.08] max-h-[calc(100vh-170px)] shadow-md transition-shadow',
        isDragging && 'opacity-40 ring-1 ring-[#5e6ad2]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 p-0.5 rounded transition-colors"
            title="Drag list"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: list.color || '#5e6ad2' }}
          />

          {isEditingName ? (
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              onBlur={handleRenameList}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameList()}
              autoFocus
              className="bg-transparent text-xs font-semibold text-white px-1 py-0.5 border-b border-indigo-500 outline-none w-full"
            />
          ) : (
            <h3
              onDoubleClick={() => setIsEditingName(true)}
              className="text-xs font-semibold text-slate-200 truncate cursor-pointer hover:text-white"
              title="Double click to rename"
            >
              {list.name}
            </h3>
          )}

          <span className="text-[10px] font-mono text-slate-500">
            {activeTasks.length}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
            title="Add task"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowListMenu(!showListMenu)}
              className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showListMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-40 p-1 rounded-lg linear-surface text-xs z-50 shadow-xl"
              >
                <button
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowListMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  Change color
                </button>
                <button
                  onClick={() => {
                    setIsEditingName(true);
                    setShowListMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-xs">A</span>
                  Rename
                </button>
                <div className="my-1 border-t border-white/[0.06]" />
                <button
                  onClick={() => {
                    deleteList(list.id);
                    setShowListMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-rose-400 hover:bg-rose-500/10 text-left transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete list
                </button>
              </div>
            )}

            {showColorPicker && (
              <div className="absolute right-0 top-full mt-1 p-2 rounded-lg linear-surface shadow-xl z-50 flex gap-1.5">
                {LIST_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      updateList(list.id, { color: c.hex });
                      setShowColorPicker(false);
                    }}
                    className="w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125 flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                  >
                    {list.color === c.hex && <Check className="w-2.5 h-2.5 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task List container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        <SortableContext items={activeTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {activeTasks.length === 0 && !isAdding && (
            <div className="py-8 text-center text-[11px] text-slate-600">
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
        <div className="p-2 border-t border-white/[0.06] bg-[#11131c]">
          <form onSubmit={handleQuickAdd} className="space-y-2">
            <input
              type="text"
              placeholder="Task title..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              autoFocus
              className="w-full px-2.5 py-1.5 text-xs rounded-md linear-input placeholder:text-slate-600"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold border transition-colors cursor-pointer',
                      taskPriority === p
                        ? 'bg-white text-black border-white'
                        : 'text-slate-500 border-white/[0.08] hover:border-white/20'
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
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!taskTitle.trim()}
                  className="px-2.5 py-0.5 text-xs font-medium rounded bg-white text-black hover:bg-slate-200 disabled:opacity-50 cursor-pointer"
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
