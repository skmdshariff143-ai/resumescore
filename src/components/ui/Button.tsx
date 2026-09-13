'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'signal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconRight,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
      md: 'px-4 py-2.5 text-xs font-bold rounded-xl gap-2',
      lg: 'px-6 py-3.5 text-sm font-bold rounded-xl gap-2.5',
    }[size];

    const variantClasses = {
      primary:
        'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 border border-blue-500/40 active:scale-[0.98]',
      signal:
        'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 border border-blue-400/40 active:scale-[0.98]',
      secondary:
        'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 active:scale-[0.98]',
      outline:
        'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 active:scale-[0.98]',
      ghost:
        'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-100 border border-transparent active:scale-[0.98]',
      danger:
        'bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 border border-rose-800/60 active:scale-[0.98]',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center transition-all duration-150 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          icon && <span className="inline-flex shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {!isLoading && iconRight && <span className="inline-flex shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
