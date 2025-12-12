import { cn } from '../../utils/cn';
import { Spinner } from './Spinner';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'default';
  loading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  className,
  loading = false,
  ...props
}: Props) => (
  <button
    className={cn(
      'font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2',
      size === 'sm' ? 'px-4 py-2 text-sm' : 'px-6 py-3.5',
     variant === 'primary' && 
  'bg-[hsl(var(--accent-h),var(--accent-s),var(--accent-l))] hover:bg-[hsl(var(--accent-h),var(--accent-s),calc(var(--accent-l)-8%))] text-white font-semibold',
      variant === 'secondary' && 
  'bg-[var(--bg-input)] hover:opacity-90 text-[var(--text-secondary)] border border-[var(--border-light)]',
      loading && 'opacity-70 cursor-wait',
      className
    )}
    {...props}
    disabled={loading}
  >
    {loading ? <Spinner /> : children}
  </button>
);