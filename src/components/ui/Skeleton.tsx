import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--surface)] border-2 border-[var(--line)]',
        className
      )}
    />
  );
};

export const BoardSkeleton: React.FC = () => {
  return (
    <div className="flex gap-6 overflow-x-auto p-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-80 flex-shrink-0 editorial-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--line)]">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3" />
              <Skeleton className="w-28 h-5" />
            </div>
            <Skeleton className="w-6 h-5" />
          </div>
          <div className="space-y-3 pt-2">
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
