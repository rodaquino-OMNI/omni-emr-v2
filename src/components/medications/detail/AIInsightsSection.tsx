
import React from 'react';
import { Sparkles, AlertCircle, Lightbulb } from 'lucide-react';

interface AIInsightsSectionProps {
  patientId: string;
  medicationId: string;
}

interface Insight {
  id: string;
  type: 'alert' | 'info' | 'suggestion';
  title: string;
  description: string;
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ patientId, medicationId }) => {
  // In a real application, fetch insights from an API
  const insights: Insight[] = [
    {
      id: '1',
      type: 'alert',
      title: 'Potential allergy detected',
      description: 'Patient has a documented allergy to a similar medication class. Consider alternative treatment.'
    },
    {
      id: '2',
      type: 'info',
      title: 'Compliance pattern',
      description: 'Patient has shown 85% medication adherence over the past 3 months based on prescription refill data.'
    },
    {
      id: '3',
      type: 'suggestion',
      title: 'Alternative option',
      description: 'Consider a combination medication to reduce pill burden and improve adherence.'
    }
  ];
  
  if (insights.length === 0) {
    return null;
  }
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getInsightClass = (type: string) => {
    switch (type) {
      case 'alert':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30';
      case 'suggestion':
        return 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30';
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Insights</h2>
      </div>
      
      <div className="space-y-3">
        {insights.map(insight => (
          <div 
            key={insight.id} 
            className={`p-4 border rounded-lg ${getInsightClass(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              {getInsightIcon(insight.type)}
              <div>
                <h3 className="text-sm font-medium">{insight.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsSection;
