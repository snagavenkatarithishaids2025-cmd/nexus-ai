import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`glass-input px-3.5 py-2 text-sm w-full ${error ? 'border-error focus:ring-error/20' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-error font-medium">{error}</span>
      )}
    </div>
  );
};
