import React from 'react';
import { BentoCard } from '../BentoCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  change?: number; // e.g. +12 or -4
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'cream' | 'green' | 'dark';
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  description,
  icon,
  className = '',
  variant = 'cream'
}) => {
  const isPositive = changeType === 'positive' || (change && change > 0);
  const isNegative = changeType === 'negative' || (change && change < 0);

  return (
    <BentoCard variant={variant} className={`relative overflow-hidden p-6 font-body ${className}`}>
      {/* Ambient glowing orb background */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
        variant === 'green' ? 'bg-white/5' : 'bg-[#004434]/5'
      }`} />

      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${
          variant === 'green' ? 'text-white/60' : 'text-[#78716C]'
        }`}>
          {title}
        </span>
        {icon && (
          <div className={variant === 'green' ? 'text-white/80' : 'text-[#78716C]'}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-3xl font-bold tracking-tight ${
          variant === 'green' ? 'text-white font-heading' : 'text-[#1C1917] font-heading'
        }`}>
          {value}
        </span>
        
        {change !== undefined && (
          <div className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded ${
            isPositive 
              ? 'bg-success-bg text-color-success-base border border-success-base/10' 
              : isNegative 
                ? 'bg-error-bg text-color-error-base border border-error-base/10' 
                : 'bg-white/5 text-slate-400 border border-slate-200'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
            ) : isNegative ? (
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
            ) : null}
            {change > 0 ? `+${change}` : change}%
          </div>
        )}
      </div>

      {description && (
        <p className={`mt-1 text-xs ${
          variant === 'green' ? 'text-white/70' : 'text-[#A8A29E]'
        }`}>
          {description}
        </p>
      )}
    </BentoCard>
  );
};
