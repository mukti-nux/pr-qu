import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    wa: 'btn-wa',
    outline: 'border border-slate-300 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'hover:bg-slate-100'
  };

  return (
    <button 
      className={twMerge('btn', variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, color = 'blue', className }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    gray: 'bg-slate-100 text-slate-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={twMerge('px-2 py-1 rounded-full text-xs font-medium', colors[color], className)}>
      {children}
    </span>
  );
};
