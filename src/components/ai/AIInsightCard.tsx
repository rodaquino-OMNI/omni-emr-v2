
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export interface ComponentAIInsight {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  source?: string;
  timestamp: string;
  patient_id?: string;
}

interface AIInsightCardProps {
  insight: ComponentAIInsight;
  className?: string;
  onClick?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  insight,
  className,
  onClick
}) => {
  // Get appropriate icon and color based on insight type
  const { icon, cardClassName } = React.useMemo(() => {
    switch (insight.type) {
      case 'critical':
        return { 
          icon: <AlertCircle className="h-5 w-5 text-destructive" />, 
          cardClassName: 'border-destructive/40 animate-pulse-subtle'
        };
      case 'warning':
        return { 
          icon: <AlertTriangle className="h-5 w-5 text-warning" />, 
          cardClassName: 'border-warning/40'
        };
      case 'success':
        return { 
          icon: <CheckCircle className="h-5 w-5 text-success" />, 
          cardClassName: 'border-success/40'
        };
      case 'info':
      default:
        return { 
          icon: <Info className="h-5 w-5 text-primary" />, 
          cardClassName: 'border-primary/40'
        };
    }
  }, [insight.type]);

  // Format timestamp
  const formattedTime = new Date(insight.timestamp).toLocaleString();

  return (
    <Card 
      className={cn("transition-all hover:shadow-md cursor-pointer", cardClassName, className)}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-base font-semibold">{insight.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm mb-2">{insight.description}</p>
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>{insight.source || 'AI Analysis'}</span>
          <span>{formattedTime}</span>
        </div>
      </CardContent>
    </Card>
  );
};
