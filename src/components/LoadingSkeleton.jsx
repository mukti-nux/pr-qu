import React from 'react';
import { twMerge } from 'tailwind-merge';

export const LoadingSkeleton = ({ className }) => {
  return (
    <div className={twMerge('animate-pulse bg-slate-200 rounded-lg', className)} />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(cols)].map((_, j) => (
            <LoadingSkeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="card p-6 space-y-4">
      <LoadingSkeleton className="h-6 w-1/3" />
      <LoadingSkeleton className="h-20 w-full" />
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-8 w-24" />
        <LoadingSkeleton className="h-8 w-24" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
