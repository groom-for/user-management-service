import { cn } from '../../lib/cn';

export function Button({ className = '', variant = 'default', ...props }) {
  return (
    <button
      className={cn(
        'shad-button',
        variant === 'outline' && 'shad-button-outline',
        className
      )}
      {...props}
    />
  );
}
