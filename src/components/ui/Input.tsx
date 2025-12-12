// src/components/ui/Input.tsx
import { cn } from '../../utils/cn';

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'w-full px-5 py-4 rounded-xl border-2 text-lg font-medium transition-all',
      'bg-[var(--bg-input)] border-[var(--border-light)]',
      'text-[var(--text-primary)] placeholder-[var(--text-secondary)]',
      'focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500',
      'dark:focus:ring-blue-400/30',
      className
    )}
    style={{
      backgroundColor: 'var(--bg-input)',
      borderColor: 'var(--border-light)',
      color: 'var(--text-primary)',
    }}
    {...props}
  />
);