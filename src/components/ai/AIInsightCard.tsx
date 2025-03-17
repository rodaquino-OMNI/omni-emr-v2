
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { ComponentAIInsight } from '@/utils/typeAdapters';

interface AIInsightCardProps {
  insight: ComponentAIInsight;
  className?: string;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, className }) => {
  const { t } = useTranslation();
  
  // Determine styles based on insight type
  const getTypeStyles = () => {
    switch (insight.type) {
      case 'critical':
        return {
          bgColor: 'bg-red-50 dark:bg-red-950',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-700 dark:text-red-400',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />
        };
      case 'warning':
        return {
          bgColor: 'bg-amber-50 dark:bg-amber-950',
          borderColor: 'border-amber-200 dark:border-amber-800',
          textColor: 'text-amber-700 dark:text-amber-400',
          icon: <AlertTriangle className="h-5 w-5 text-amber-600" />
        };
      case 'success':
        return {
          bgColor: 'bg-green-50 dark:bg-green-950',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-700 dark:text-green-400',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-50 dark:bg-blue-950',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-700 dark:text-blue-400',
          icon: <Info className="h-5 w-5 text-blue-600" />
        };
    }
  };
  
  const styles = getTypeStyles();
  
  // Format the timestamp
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };
  
  return (
    <Card 
      className={cn(
        styles.bgColor, 
        styles.borderColor,
        'transition-all hover:shadow-md',
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className={cn("flex items-center text-lg", styles.textColor)}>
          {styles.icon}
          <span className="ml-2">{insight.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">{insight.content}</p>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-4">
          {insight.source && (
            <span>{t('source')}: {insight.source}</span>
          )}
          {insight.timestamp && (
            <span>{formatTimestamp(insight.timestamp)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;
