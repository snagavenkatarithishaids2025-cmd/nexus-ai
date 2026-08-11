import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded bg-white/5 ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="glass-panel rounded-xl p-5 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
    <Skeleton className="h-8 w-2/3" />
    <Skeleton className="h-3 w-5/6" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-36 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-panel p-6 rounded-xl space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);
