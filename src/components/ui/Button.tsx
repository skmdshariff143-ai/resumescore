'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
 variant?:'primary'|'secondary'|'outline'|'ghost'|'danger'|'signal';
 size?:'sm'|'md'|'lg';isLoading?:boolean;icon?:React.ReactNode;iconRight?:React.ReactNode;
}
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(
 ({children,variant='primary',size='md',isLoading=false,icon,iconRight,className='',disabled,type='button',...props},ref)=>
 <button ref={ref} type={type} disabled={disabled||isLoading} aria-busy={isLoading||undefined} className={`action ${variant==='primary'||variant==='signal'?'action-primary':variant==='danger'?'action-danger':''} ${size==='lg'?'px-6 py-3.5':size==='sm'?'px-3':'px-4'} disabled:cursor-not-allowed ${className}`} {...props}>
 {isLoading?<Loader2 size={16} className="shrink-0 animate-spin"/>:icon&&<span className="inline-flex shrink-0">{icon}</span>}<span>{children}</span>{!isLoading&&iconRight&&<span className="inline-flex shrink-0">{iconRight}</span>}
 </button>
);
Button.displayName='Button';
