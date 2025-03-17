
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIInsight } from '@/types/patient';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePatientInsights } from '@/hooks/usePatientInsights'; 
import { adaptToComponentAIInsight } from '@/utils/typeAdapters';

interface PatientAIInsightsTabProps {
  patientId?: string;
  insights?: AIInsight[];
  isLoading?: boolean;
}

export const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({ 
  patientId, 
  insights: propInsights,
  isLoading: propIsLoading 
}) => {
  // If insights are passed directly as props, use them
  // Otherwise, fetch them using the hook
  const { 
    insights: hookInsights, 
    isLoading: hookIsLoading 
  } = patientId ? usePatientInsights(patientId) : { insights: [], isLoading: false };
  
  const insights = propInsights || hookInsights || [];
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!insights.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No AI insights available for this patient.
        </CardContent>
      </Card>
    );
  }
  
  // Group insights by category
  const groupedInsights = insights.reduce((acc, insight) => {
    const category = insight.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(insight);
    return acc;
  }, {} as Record<string, AIInsight[]>);
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedInsights).map(([category, categoryInsights]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const InsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  const severityColors = {
    low: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20",
    medium: "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20",
    high: "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20",
    critical: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20"
  };
  
  return (
    <div className={`p-4 rounded-md border ${severityColors[insight.severity]}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{insight.title}</h3>
        <div className="text-xs font-medium px-2 py-1 rounded-full bg-background">
          {insight.severity}
        </div>
      </div>
      <p className="mt-2 text-sm">{insight.description}</p>
      {insight.action_required && (
        <div className="mt-3 text-sm font-medium">
          <span className="text-primary">Recommended action:</span> {insight.action_description}
        </div>
      )}
    </div>
  );
};

export default PatientAIInsightsTab;
