
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ErrorMessageProps {
  title: string;
  message: string | null;
  className?: string;
  variant?: 'default' | 'destructive';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',  // Provide a default title
  message,
  className,
  variant = 'destructive'
}) => {
  const variantStyles = variant === 'destructive' 
    ? 'border-red-200 dark:border-red-800' 
    : 'border-orange-200 dark:border-orange-800';

  const titleStyles = variant === 'destructive'
    ? 'text-red-600 dark:text-red-400'
    : 'text-orange-600 dark:text-orange-400';

  return (
    <Card className={cn(variantStyles, className)}>
      <CardHeader className="pb-2">
        <CardTitle className={cn("flex items-center text-lg", titleStyles)}>
          <AlertCircle className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      {message && (
        <CardContent>
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      )}
    </Card>
  );
};
