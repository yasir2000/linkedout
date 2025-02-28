'use client';

import { Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TodoStatus = 'pending' | 'loading' | 'success' | 'error';

interface TodoItemProps {
  status: TodoStatus;
  label: string;
  errorMessage?: string;
}

export function TodoItem({ status, label, errorMessage }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-shrink-0">
        {status === 'pending' && (
          <div className="h-5 w-5 rounded-sm border border-primary flex items-center justify-center" />
        )}
        {status === 'loading' && (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
        {status === 'success' && (
          <div className="h-5 w-5 rounded-sm bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
        {status === 'error' && (
          <div className="h-5 w-5 rounded-sm bg-destructive flex items-center justify-center">
            <X className="h-3 w-3 text-destructive-foreground" />
          </div>
        )}
      </div>
      <div className="flex-grow">
        <p className={cn(
          "text-sm",
          status === 'error' && "text-destructive"
        )}>
          {label}
        </p>
        {status === 'error' && errorMessage && (
          <p className="text-xs text-destructive mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}