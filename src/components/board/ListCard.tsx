import React, { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreVertical, Trash2, Palette, GripVertical, Check } from 'lucide-react';
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
        'w-80 flex-shrink-0 flex flex-col rounded-2xl glass-card border border-white/10 max-h-[calc(100vh-195px)] shadow-xl transition-shadow',
        isDragging && 'opacity-50 ring-2 ring-blue-500 shadow-2xl'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
            title="Drag list"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* User-assignable Accent Color Dot */}
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
            style={{ backgroundColor: list.color || '#3b82f6' }}
          />

          {isEditingName ? (
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              onBlur={handleRenameList}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameList()}
              autoFocus
              className="bg-transparent text-sm font-semibold text-white px-1 py-0.5 border-b border-blue-500 outline-none w-full"
            />
          ) : (
            <h3
              onDoubleClick={() => setIsEditingName(true)}
              className="text-sm font-semibold text-slate-100 truncate cursor-pointer hover:text-white"
              title="Double click to rename"
            >
              {list.name}
            </h3>
          )}

          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono">
            {activeTasks.length}
          </span>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowListMenu(!showListMenu)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showListMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1 w-44 p-1.5 rounded-xl bg-[#181a22] border border-white/10 shadow-2xl z-50 text-xs backdrop-blur-xl"
            >
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowListMenu(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5 text-blue-400" />
                Change Color
              </button>
              <button
                onClick={() => {
                  setIsEditingName(true);
                  setShowListMenu(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
              >
                <span className="font-semibold">A</span>
                Rename List
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => {
                  deleteList(list.id);
                  setShowListMenu(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-left transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete List
              </button>
            </div>
          )}

          {/* Color Picker Popover */}
          {showColorPicker && (
            <div className="absolute right-0 top-full mt-1 p-2 rounded-xl bg-[#181a22] border border-white/10 shadow-2xl z-50 flex gap-1.5 backdrop-blur-xl">
              {LIST_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    updateList(list.id, { color: c.hex });
                    setShowColorPicker(false);
                  }}
                  className="w-5 h-5 rounded-full transition-transform hover:scale-125 border border-white/20 flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: c.hex }}
                >
                  {list.color === c.hex && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <SortableContext items={activeTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {activeTasks.length === 0 && !isAdding && (
            <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-white/5 rounded-xl">
              No tasks yet
            </div>
          )}
          {activeTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Completed Tasks Accordion */}
        {showCompleted && <CompletedAccordion completedTasks={completedTasks} />}
      </div>

      {/* Inline Quick Add Input */}
      <div className="p-3 border-t border-white/5 bg-white/[0.01]">
        {isAdding ? (
          <form onSubmit={handleQuickAdd} className="space-y-2">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 text-xs rounded-xl glass-input placeholder:text-slate-500"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold border transition-colors cursor-pointer',
                      taskPriority === p
                        ? 'bg-blue-500 text-white border-blue-400'
                        : 'text-slate-400 border-white/10 hover:border-white/20'
                    )}
                  >
                    {p[0]}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setTaskTitle('');
                  }}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!taskTitle.trim()}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Add task</span>
          </button>
        )}
      </div>
    </div>
  );
};
