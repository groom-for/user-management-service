import { cn } from '../../lib/cn';

export function Label({ className = '', htmlFor, ...props }) {
  return (
    <label
      className={cn('shad-label', className)}
      htmlFor={htmlFor}
      {...props}
    />
  );
}
