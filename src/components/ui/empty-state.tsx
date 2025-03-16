
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, RefreshCw, Filter } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'default' | 'search' | 'error' | 'filter';
}

export const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
  variant = 'default'
}: EmptyStateProps) => {
  // Choose icon based on variant if not provided
  const renderIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'search':
        return <Search className="h-10 w-10 text-muted-foreground/70" />;
      case 'error':
        return <AlertCircle className="h-10 w-10 text-destructive/70" />;
      case 'filter':
        return <Filter className="h-10 w-10 text-muted-foreground/70" />;
      default:
        return <RefreshCw className="h-10 w-10 text-muted-foreground/70" />;
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/40",
      className
    )}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-sm">
        {renderIcon()}
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
