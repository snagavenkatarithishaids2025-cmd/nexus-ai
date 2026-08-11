'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-accent-primary hover:bg-accent-primary-hover text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)] border border-accent-primary/20',
    secondary: 'bg-white/5 hover:bg-white/10 text-text-secondary border border-white/5',
    danger: 'bg-error hover:bg-red-600 text-white shadow-[0_4px_20px_rgba(239,68,68,0.25)] border border-error/20',
    ghost: 'hover:bg-white/5 text-text-muted hover:text-text-primary',
    outline: 'border border-white/10 hover:border-white/20 text-text-secondary hover:bg-white/5'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
