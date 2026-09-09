export type TaskPriority = 'low' | 'medium' | 'high';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  theme: 'dark' | 'light';
  email_notifications: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TaskList {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  position: number;
  created_at: string;
  updated_at?: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at?: string;
}

export interface TaskItem {
  id: string;
  user_id: string;
  list_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completed_at: string | null;
  priority: TaskPriority;
  due_date: string | null;
  starred: boolean;
  position: number;
  tags?: Tag[];
  created_at: string;
  updated_at?: string;
}

export type ViewMode = 'board' | 'calendar';

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'error' | 'undo';
  message: string;
  onUndo?: () => void;
  duration?: number;
}
