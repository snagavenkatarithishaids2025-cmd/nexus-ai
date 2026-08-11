import React from 'react';

type BadgeType = 
  | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  | 'STABLE' | 'WARNING' | 'CRITICAL'
  | 'default';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeType;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const styles: Record<BadgeType, string> = {
    LOW: 'bg-white/5 text-text-muted border-white/10',
    MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    HIGH: 'bg-warning-bg text-color-warning-base border-warning-base/20',
    URGENT: 'bg-error-bg text-color-error-base border-error-base/20 animate-pulse',
    
    TODO: 'bg-white/5 text-text-muted border-white/10',
    IN_PROGRESS: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    REVIEW: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    DONE: 'bg-success-bg text-color-success-base border-success-base/20',
    
    STABLE: 'bg-success-bg text-color-success-base border-success-base/20',
    WARNING: 'bg-warning-bg text-color-warning-base border-warning-base/20',
    CRITICAL: 'bg-error-bg text-color-error-base border-error-base/20',
    
    default: 'bg-white/5 text-text-secondary border-white/10'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
