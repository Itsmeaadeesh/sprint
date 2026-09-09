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

  const displayedLists = selectedListId === 'all'
    ? lists
    : lists.filter((l) => l.id === selectedListId);

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

    if (isActiveTask && isOverTask) {
      const activeTaskItem = tasks.find((t) => t.id === activeId);
      const overTaskItem = tasks.find((t) => t.id === overId);

      if (activeTaskItem && overTaskItem && activeTaskItem.list_id !== overTaskItem.list_id) {
        moveTask(activeId, overTaskItem.list_id);
      }
    }

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

    if (active.data.current?.type === 'List' && over.data.current?.type === 'List') {
      reorderLists(activeId, overId);
      return;
    }

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
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6 font-mono">
        <div className="flex items-start gap-5 min-w-max pb-4">
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

          {/* Brutalist Add List button */}
          {selectedListId === 'all' && (
            <button
              onClick={onCreateListModalOpen}
              className="w-80 h-12 flex-shrink-0 editorial-border border-dashed hover:bg-[var(--hover-bg)] flex items-center justify-center gap-2 text-[var(--fg)] text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New list</span>
            </button>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="w-72">
            <TaskRow task={activeTask} isDragging />
          </div>
        )}
        {activeList && (
          <div className="w-76 opacity-90">
            <ListCard list={activeList} tasks={getFilteredTasksForList(activeList.id)} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
