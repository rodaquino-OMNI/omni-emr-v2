
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export type InsightType = 'info' | 'warning' | 'critical' | 'positive';
export type InsightSource = 'vitals' | 'labs' | 'medications' | 'tasks' | 'general';

export interface AIInsight {
  id: string;
  type: InsightType;
  source: InsightSource;
  title: string;
  description: string;
  relatedTo?: {
    type: string;
    id: string;
  };
  timestamp: Date;
}

interface AIInsightsProps {
  insights: AIInsight[];
  compact?: boolean;
  maxItems?: number;
  showSource?: boolean;
  className?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({
  insights,
  compact = false,
  maxItems,
  showSource = true,
  className
}) => {
  // Sort insights by type (critical first) and then by timestamp (newest first)
  const sortedInsights = [...insights].sort((a, b) => {
    const typeOrder = { critical: 0, warning: 1, info: 2, positive: 3 };
    const typeDiff = 
      typeOrder[a.type as keyof typeof typeOrder] - 
      typeOrder[b.type as keyof typeof typeOrder];
    
    if (typeDiff !== 0) return typeDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const displayInsights = maxItems ? sortedInsights.slice(0, maxItems) : sortedInsights;

  // Get style based on insight type
  const getTypeStyles = (type: InsightType) => {
    switch (type) {
      case 'critical':
        return {
          border: 'border-red-200 dark:border-red-800',
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
        };
      case 'warning':
        return {
          border: 'border-amber-200 dark:border-amber-800',
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          text: 'text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
        };
      case 'positive':
        return {
          border: 'border-green-200 dark:border-green-800',
          bg: 'bg-green-50 dark:bg-green-900/20',
          text: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
        };
      default: // info
        return {
          border: 'border-blue-200 dark:border-blue-800',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
        };
    }
  };

  // Get source label
  const getSourceLabel = (source: InsightSource) => {
    switch (source) {
      case 'vitals': return 'Vitals';
      case 'labs': return 'Labs';
      case 'medications': return 'Medications';
      case 'tasks': return 'Tasks';
      default: return 'General';
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {!compact && (
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="font-medium">AI Clinical Insights</h3>
        </div>
      )}
      
      <div className="space-y-3">
        {displayInsights.map((insight) => {
          const styles = getTypeStyles(insight.type);
          
          return (
            <Card 
              key={insight.id}
              className={`p-3 border ${styles.border} ${styles.bg}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="ai">{compact ? 'AI' : 'AI Assistant'}</Badge>
                    {showSource && (
                      <Badge variant="outline" className={styles.badge}>
                        {getSourceLabel(insight.source)}
                      </Badge>
                    )}
                  </div>
                  <h4 className={`text-sm font-medium ${styles.text}`}>
                    {insight.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsights;
