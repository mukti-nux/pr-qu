import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Badge = ({ children, color = 'blue', className }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    gray: 'bg-slate-100 text-slate-700',
    purple: 'bg-purple-100 text-purple-700 font-bold',
  };

  return (
    <span className={twMerge('px-2 py-1 rounded-full text-xs font-semibold', colors[color], className)}>
      {children}
    </span>
  );
};

export default Badge;
