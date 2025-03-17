
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ComponentAIInsight } from '@/utils/typeAdapters';
import { formatRelativeTime } from '@/utils/dateUtils';

interface AIInsightCardProps {
  insight: ComponentAIInsight;
  onDismiss?: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  insight,
  onDismiss,
  onAction
}) => {
  const cardClassName = () => {
    switch (insight.type) {
      case 'critical':
        return 'border-red-200 dark:border-red-800';
      case 'warning':
        return 'border-amber-200 dark:border-amber-800';
      case 'success':
        return 'border-green-200 dark:border-green-800';
      case 'info':
      default:
        return 'border-blue-200 dark:border-blue-800';
    }
  };

  const iconClassName = () => {
    switch (insight.type) {
      case 'critical':
        return 'text-red-500 dark:text-red-400';
      case 'warning':
        return 'text-amber-500 dark:text-amber-400';
      case 'success':
        return 'text-green-500 dark:text-green-400';
      case 'info':
      default:
        return 'text-blue-500 dark:text-blue-400';
    }
  };

  const Icon = () => {
    switch (insight.type) {
      case 'critical':
        return <AlertCircle className={`h-5 w-5 ${iconClassName()}`} />;
      case 'warning':
        return <AlertTriangle className={`h-5 w-5 ${iconClassName()}`} />;
      case 'success':
        return <CheckCircle className={`h-5 w-5 ${iconClassName()}`} />;
      case 'info':
      default:
        return <Info className={`h-5 w-5 ${iconClassName()}`} />;
    }
  };

  return (
    <Card className={cardClassName()}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="flex items-center">
          <Icon />
          <CardTitle className="ml-2 text-lg">{insight.title}</CardTitle>
        </div>
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDismiss(insight.id)}
            className="h-8 w-8 p-0"
          >
            &times;
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{insight.content}</p>
        {insight.description && (
          <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            {insight.source && (
              <span className="text-xs text-muted-foreground">
                Source: {insight.source}
              </span>
            )}
          </div>
          {insight.timestamp && (
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(new Date(insight.timestamp))}
            </span>
          )}
        </div>
        {onAction && (
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAction(insight.id, 'acknowledge')}
              className="text-xs"
            >
              Acknowledge
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAction(insight.id, 'details')}
              className="text-xs"
            >
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;
