import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-xs font-medium text-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border border-border/50 bg-surface-2/50 px-3 py-2 text-sm text-foreground transition-all duration-300',
            'placeholder:text-text-tertiary',
            'hover:border-border-glow/40',
            'focus:border-ring/60 focus:bg-surface-2/80 focus:outline-none focus:ring-2 focus:ring-ring/10',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none',
            error && 'border-error/60 focus:border-error focus:ring-error/10',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
