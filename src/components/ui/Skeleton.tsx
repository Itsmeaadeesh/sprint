import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-white/5 border border-white/5 relative overflow-hidden',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent',
        className
      )}
    />
  );
};

export const BoardSkeleton: React.FC = () => {
  return (
    <div className="flex gap-6 overflow-x-auto p-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-80 flex-shrink-0 rounded-2xl glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-28 h-5" />
            </div>
            <Skeleton className="w-6 h-5 rounded-full" />
          </div>
          <div className="space-y-2.5 pt-2">
            <Skeleton className="w-full h-16 rounded-xl" />
            <Skeleton className="w-full h-16 rounded-xl" />
            <Skeleton className="w-full h-16 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};
