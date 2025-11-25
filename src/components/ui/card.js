import { cn } from '../../lib/cn';

export function Card({ className = '', ...props }) {
  return <div className={cn('shad-card', className)} {...props} />;
}

export function CardHeader({ className = '', ...props }) {
  return <div className={cn('shad-card-header', className)} {...props} />;
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h2 className={cn('shad-card-title', className)} {...props}>
      {children}
    </h2>
  );
}

export function CardDescription({ className = '', ...props }) {
  return <p className={cn('shad-card-description', className)} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={cn('shad-card-content', className)} {...props} />;
}

export function CardFooter({ className = '', ...props }) {
  return <div className={cn('shad-card-footer', className)} {...props} />;
}
