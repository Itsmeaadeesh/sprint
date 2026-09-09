import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TaskPriority } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LIST_COLORS = [
  { name: 'Indigo', hex: '#5e6ad2', bg: 'bg-[#5e6ad2]' },
  { name: 'Blue', hex: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Emerald', hex: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Amber', hex: '#f59e0b', bg: 'bg-amber-500' },
  { name: 'Rose', hex: '#f43f5e', bg: 'bg-rose-500' },
  { name: 'Purple', hex: '#a855f7', bg: 'bg-purple-500' },
  { name: 'Cyan', hex: '#06b6d4', bg: 'bg-cyan-500' },
  { name: 'Zinc', hex: '#71717a', bg: 'bg-zinc-500' },
];

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const today = new Date();
  const isSameYear = date.getFullYear() === today.getFullYear();
  
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const diffDays = Math.round((dateMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(isSameYear ? {} : { year: 'numeric' }),
  };

  return date.toLocaleDateString(undefined, options);
}

export function isOverdue(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return dateMidnight < todayMidnight;
}

export function isDueToday(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function getPriorityStyles(priority: TaskPriority) {
  switch (priority) {
    case 'high':
      return {
        label: 'High',
        badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        dot: 'bg-rose-400',
        bars: 3,
      };
    case 'medium':
      return {
        label: 'Med',
        badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        dot: 'bg-amber-400',
        bars: 2,
      };
    case 'low':
    default:
      return {
        label: 'Low',
        badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        dot: 'bg-blue-400',
        bars: 1,
      };
  }
}
