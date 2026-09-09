import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { TaskList, TaskItem, Tag, ViewMode, ToastNotification, TaskPriority } from '../types';

interface BoardContextType {
  lists: TaskList[];
  tasks: TaskItem[];
  tags: Tag[];
  loading: boolean;
  selectedListId: string | 'all';
  setSelectedListId: (id: string | 'all') => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: TaskPriority | 'all';
  setFilterPriority: (priority: TaskPriority | 'all') => void;
  toast: ToastNotification | null;
  dismissToast: () => void;
  
  // List operations
  createList: (name: string, color?: string, icon?: string) => Promise<TaskList | null>;
  updateList: (id: string, updates: Partial<TaskList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  reorderLists: (activeId: string, overId: string) => Promise<void>;

  // Task operations
  createTask: (task: {
    title: string;
    list_id: string;
    description?: string;
    priority?: TaskPriority;
    due_date?: string | null;
    starred?: boolean;
  }) => Promise<TaskItem | null>;
  updateTask: (id: string, updates: Partial<TaskItem>) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;
  toggleTaskStarred: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, targetListId: string, newPosition?: number) => Promise<void>;
  reorderTasksInList: (listId: string, activeId: string, overId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [lists, setLists] = useState<TaskList[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showCompleted, setShowCompleted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ ...notification, id });

    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, notification.duration || 4500);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!user) {
      setLists([]);
      setTasks([]);
      setTags([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (!isSupabaseConfigured) {
      // Offline fallback: load from user-specific localStorage key
      const storedLists = localStorage.getItem(`sprint_lists_${user.id}`);
      const storedTasks = localStorage.getItem(`sprint_tasks_${user.id}`);
      const storedTags = localStorage.getItem(`sprint_tags_${user.id}`);

      setLists(storedLists ? JSON.parse(storedLists) : []);
      setTasks(storedTasks ? JSON.parse(storedTasks) : []);
      setTags(storedTags ? JSON.parse(storedTags) : []);
      setLoading(false);
      return;
    }

    try {
      const [listsRes, tasksRes, tagsRes] = await Promise.all([
        supabase.from('lists').select('*').eq('user_id', user.id).order('position', { ascending: true }),
        supabase.from('tasks').select('*').eq('user_id', user.id).order('position', { ascending: true }),
        supabase.from('tags').select('*').eq('user_id', user.id),
      ]);

      if (listsRes.error) throw listsRes.error;
      if (tasksRes.error) throw tasksRes.error;
      if (tagsRes.error) throw tagsRes.error;

      setLists(listsRes.data as TaskList[] || []);
      setTasks(tasksRes.data as TaskItem[] || []);
      setTags(tagsRes.data as Tag[] || []);
    } catch (err) {
      console.error('Failed to load board data:', err);
      showToast({
        type: 'error',
        message: 'Failed to sync with Supabase. Check your connection.',
      });
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Supabase Real-time Subscriptions
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const channel = supabase
      .channel(`board_changes_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lists', filter: `user_id=eq.${user.id}` },
        () => {
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchData]);

  // Helper to persist in offline mode
  const persistOffline = (newLists?: TaskList[], newTasks?: TaskItem[]) => {
    if (!user) return;
    if (newLists !== undefined) {
      localStorage.setItem(`sprint_lists_${user.id}`, JSON.stringify(newLists));
    }
    if (newTasks !== undefined) {
      localStorage.setItem(`sprint_tasks_${user.id}`, JSON.stringify(newTasks));
    }
  };

  // List Operations
  const createList = async (name: string, color = '#3b82f6', icon = 'list'): Promise<TaskList | null> => {
    if (!user) return null;
    const newPos = lists.length;
    const optimisticList: TaskList = {
      id: isSupabaseConfigured ? undefined as unknown as string : 'list_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      name,
      color,
      icon,
      position: newPos,
      created_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const updated = [...lists, optimisticList];
      setLists(updated);
      persistOffline(updated);
      showToast({ type: 'success', message: `List "${name}" created` });
      return optimisticList;
    }

    try {
      const { data, error } = await supabase
        .from('lists')
        .insert([{ user_id: user.id, name, color, icon, position: newPos }])
        .select()
        .single();

      if (error) throw error;
      const created = data as TaskList;
      setLists(prev => [...prev, created]);
      showToast({ type: 'success', message: `List "${name}" created` });
      return created;
    } catch (err) {
      console.error('Error creating list:', err);
      showToast({ type: 'error', message: 'Failed to create list' });
      return null;
    }
  };

  const updateList = async (id: string, updates: Partial<TaskList>) => {
    setLists(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    if (!isSupabaseConfigured) {
      persistOffline(lists.map(l => l.id === id ? { ...l, ...updates } : l));
      return;
    }
    await supabase.from('lists').update(updates).eq('id', id);
  };

  const deleteList = async (id: string) => {
    const listToDelete = lists.find(l => l.id === id);
    const affectedTasks = tasks.filter(t => t.list_id === id);
    
    // Optimistic removal
    setLists(prev => prev.filter(l => l.id !== id));
    setTasks(prev => prev.filter(t => t.list_id !== id));
    if (selectedListId === id) setSelectedListId('all');

    showToast({
      type: 'undo',
      message: `Deleted list "${listToDelete?.name || ''}"`,
      onUndo: async () => {
        if (listToDelete) {
          setLists(prev => [...prev, listToDelete]);
          setTasks(prev => [...prev, ...affectedTasks]);
          if (!isSupabaseConfigured) {
            persistOffline([...lists, listToDelete], [...tasks, ...affectedTasks]);
          } else {
            await supabase.from('lists').insert([listToDelete]);
            if (affectedTasks.length > 0) {
              await supabase.from('tasks').insert(affectedTasks);
            }
          }
        }
      },
    });

    if (!isSupabaseConfigured) {
      persistOffline(lists.filter(l => l.id !== id), tasks.filter(t => t.list_id !== id));
      return;
    }
    await supabase.from('lists').delete().eq('id', id);
  };

  const reorderLists = async (activeId: string, overId: string) => {
    const oldIndex = lists.findIndex(l => l.id === activeId);
    const newIndex = lists.findIndex(l => l.id === overId);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const reordered = [...lists];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({ ...item, position: idx }));
    setLists(updated);

    if (!isSupabaseConfigured) {
      persistOffline(updated);
      return;
    }

    try {
      await Promise.all(
        updated.map(item =>
          supabase.from('lists').update({ position: item.position }).eq('id', item.id)
        )
      );
    } catch (err) {
      console.error('Error reordering lists:', err);
    }
  };

  // Task Operations
  const createTask = async (taskData: {
    title: string;
    list_id: string;
    description?: string;
    priority?: TaskPriority;
    due_date?: string | null;
    starred?: boolean;
  }): Promise<TaskItem | null> => {
    if (!user) return null;
    const listTasks = tasks.filter(t => t.list_id === taskData.list_id);
    const position = listTasks.length;

    const newTask: TaskItem = {
      id: isSupabaseConfigured ? undefined as unknown as string : 'task_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      list_id: taskData.list_id,
      title: taskData.title.trim(),
      description: taskData.description || null,
      completed: false,
      completed_at: null,
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date || null,
      starred: taskData.starred || false,
      position,
      created_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const updated = [newTask, ...tasks];
      setTasks(updated);
      persistOffline(undefined, updated);
      showToast({ type: 'success', message: 'Task added' });
      return newTask;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: user.id,
          list_id: taskData.list_id,
          title: taskData.title.trim(),
          description: taskData.description || null,
          completed: false,
          priority: taskData.priority || 'medium',
          due_date: taskData.due_date || null,
          starred: taskData.starred || false,
          position,
        }])
        .select()
        .single();

      if (error) throw error;
      const created = data as TaskItem;
      setTasks(prev => [created, ...prev]);
      showToast({ type: 'success', message: 'Task added' });
      return created;
    } catch (err) {
      console.error('Error creating task:', err);
      showToast({ type: 'error', message: 'Failed to create task' });
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskItem>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t));
    if (!isSupabaseConfigured) {
      persistOffline(undefined, tasks.map(t => t.id === id ? { ...t, ...updates } : t));
      return;
    }
    await supabase.from('tasks').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  };

  const toggleTaskCompleted = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    const completed_at = newCompleted ? new Date().toISOString() : null;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted, completed_at } : t));

    showToast({
      type: 'undo',
      message: newCompleted ? `Completed: "${task.title}"` : `Marked incomplete: "${task.title}"`,
      onUndo: async () => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: task.completed, completed_at: task.completed_at } : t));
        if (!isSupabaseConfigured) {
          persistOffline(undefined, tasks.map(t => t.id === id ? task : t));
        } else {
          await supabase.from('tasks').update({ completed: task.completed, completed_at: task.completed_at }).eq('id', id);
        }
      },
    });

    if (!isSupabaseConfigured) {
      persistOffline(undefined, tasks.map(t => t.id === id ? { ...t, completed: newCompleted, completed_at } : t));
      return;
    }
    await supabase.from('tasks').update({ completed: newCompleted, completed_at }).eq('id', id);
  };

  const toggleTaskStarred = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStarred = !task.starred;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, starred: newStarred } : t));

    if (!isSupabaseConfigured) {
      persistOffline(undefined, tasks.map(t => t.id === id ? { ...t, starred: newStarred } : t));
      return;
    }
    await supabase.from('tasks').update({ starred: newStarred }).eq('id', id);
  };

  const deleteTask = async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(t => t.id !== id));

    showToast({
      type: 'undo',
      message: `Deleted task "${taskToDelete.title}"`,
      onUndo: async () => {
        setTasks(prev => [...prev, taskToDelete]);
        if (!isSupabaseConfigured) {
          persistOffline(undefined, [...tasks, taskToDelete]);
        } else {
          await supabase.from('tasks').insert([taskToDelete]);
        }
      },
    });

    if (!isSupabaseConfigured) {
      persistOffline(undefined, tasks.filter(t => t.id !== id));
      return;
    }
    await supabase.from('tasks').delete().eq('id', id);
  };

  const moveTask = async (taskId: string, targetListId: string, newPosition?: number) => {
    const pos = newPosition !== undefined ? newPosition : tasks.filter(t => t.list_id === targetListId).length;

    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, list_id: targetListId, position: pos };
      }
      return t;
    });

    setTasks(updatedTasks);

    if (!isSupabaseConfigured) {
      persistOffline(undefined, updatedTasks);
      return;
    }

    await supabase.from('tasks').update({ list_id: targetListId, position: pos }).eq('id', taskId);
  };

  const reorderTasksInList = async (listId: string, activeId: string, overId: string) => {
    const listTasks = tasks.filter(t => t.list_id === listId).sort((a, b) => a.position - b.position);
    const oldIndex = listTasks.findIndex(t => t.id === activeId);
    const newIndex = listTasks.findIndex(t => t.id === overId);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const reordered = [...listTasks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const updatedListTasks = reordered.map((item, idx) => ({ ...item, position: idx }));
    const otherTasks = tasks.filter(t => t.list_id !== listId);
    const allUpdated = [...otherTasks, ...updatedListTasks];

    setTasks(allUpdated);

    if (!isSupabaseConfigured) {
      persistOffline(undefined, allUpdated);
      return;
    }

    try {
      await Promise.all(
        updatedListTasks.map(item =>
          supabase.from('tasks').update({ position: item.position }).eq('id', item.id)
        )
      );
    } catch (err) {
      console.error('Error reordering tasks:', err);
    }
  };

  return (
    <BoardContext.Provider
      value={{
        lists,
        tasks,
        tags,
        loading,
        selectedListId,
        setSelectedListId,
        viewMode,
        setViewMode,
        showCompleted,
        setShowCompleted,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        toast,
        dismissToast,
        createList,
        updateList,
        deleteList,
        reorderLists,
        createTask,
        updateTask,
        toggleTaskCompleted,
        toggleTaskStarred,
        deleteTask,
        moveTask,
        reorderTasksInList,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = (): BoardContextType => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
