import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import { ListCard } from './ListCard';
import { TaskRow } from './TaskRow';
import { EmptyState } from '../ui/EmptyState';
import type { TaskList, TaskItem } from '../../types';

interface BoardViewProps {
  onCreateListModalOpen: () => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ onCreateListModalOpen }) => {
  const {
    lists,
    tasks,
    selectedListId,
    reorderLists,
    moveTask,
    reorderTasksInList,
    searchQuery,
    filterPriority,
  } = useBoard();

  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [activeList, setActiveList] = useState<TaskList | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter lists if a specific tab list is selected
  const displayedLists = selectedListId === 'all'
    ? lists
    : lists.filter((l) => l.id === selectedListId);

  // Filter tasks based on search & priority
  const getFilteredTasksForList = (listId: string) => {
    return tasks.filter((t) => {
      if (t.list_id !== listId) return false;
      if (searchQuery) {
        const matchesTitle = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDesc = t.description?.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesTitle && !matchesDesc) return false;
      }
      if (filterPriority !== 'all' && t.priority !== filterPriority) {
        return false;
      }
      return true;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'List') {
      setActiveList(activeData.list);
    } else {
      const task = tasks.find((t) => t.id === active.id);
      if (task) setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveTask = !active.data.current?.type || active.data.current.type !== 'List';
    const isOverTask = !over.data.current?.type || over.data.current.type !== 'List';

    if (!isActiveTask) return;

    // Moving task over another task in a different list
    if (isActiveTask && isOverTask) {
      const activeTaskItem = tasks.find((t) => t.id === activeId);
      const overTaskItem = tasks.find((t) => t.id === overId);

      if (activeTaskItem && overTaskItem && activeTaskItem.list_id !== overTaskItem.list_id) {
        moveTask(activeId, overTaskItem.list_id);
      }
    }

    // Moving task directly over a list column
    const isOverList = over.data.current?.type === 'List';
    if (isActiveTask && isOverList) {
      const activeTaskItem = tasks.find((t) => t.id === activeId);
      if (activeTaskItem && activeTaskItem.list_id !== overId) {
        moveTask(activeId, overId);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setActiveList(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Reordering lists
    if (active.data.current?.type === 'List' && over.data.current?.type === 'List') {
      reorderLists(activeId, overId);
      return;
    }

    // Reordering tasks within the same list
    const activeTaskItem = tasks.find((t) => t.id === activeId);
    const overTaskItem = tasks.find((t) => t.id === overId);

    if (activeTaskItem && overTaskItem && activeTaskItem.list_id === overTaskItem.list_id) {
      reorderTasksInList(activeTaskItem.list_id, activeId, overId);
    }
  };

  if (lists.length === 0) {
    return <EmptyState onCreateList={onCreateListModalOpen} />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex items-start gap-6 min-w-max pb-6">
          <SortableContext
            items={displayedLists.map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            {displayedLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                tasks={getFilteredTasksForList(list.id)}
              />
            ))}
          </SortableContext>

          {/* Add List Column CTA Button */}
          {selectedListId === 'all' && (
            <button
              onClick={onCreateListModalOpen}
              className="w-80 h-32 flex-shrink-0 rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/40 hover:bg-white/[0.02] flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-200 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-blue-500/20 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Add another list</span>
            </button>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && (
          <div className="w-72">
            <TaskRow task={activeTask} isDragging />
          </div>
        )}
        {activeList && (
          <div className="w-80 opacity-90">
            <ListCard list={activeList} tasks={getFilteredTasksForList(activeList.id)} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
