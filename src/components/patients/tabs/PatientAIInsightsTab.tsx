
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import { AIInsight } from '@/types/patient';
import AIInsights from '@/components/ai/AIInsights';
import { ComponentAIInsight, adaptToComponentAIInsight } from '@/utils/typeAdapters';

export interface PatientAIInsightsTabProps {
  patientId: string;
  insights?: AIInsight[];
  isLoading?: boolean;
}

const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({ 
  patientId,
  insights: externalInsights,
  isLoading: externalLoading = false
}) => {
  // If insights are not provided externally, fetch them
  const { insights: fetchedInsights, isLoading: fetchLoading } = !externalInsights ? 
    usePatientInsights(patientId) : { insights: [], isLoading: false };
  
  const insights = externalInsights || fetchedInsights;
  const isLoading = externalLoading || fetchLoading;
  
  // Convert AIInsight to ComponentAIInsight format for the AIInsights component
  const adaptedInsights: ComponentAIInsight[] = insights.map(insight => {
    return adaptToComponentAIInsight(insight);
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No AI insights available for this patient.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <AIInsights insights={adaptedInsights} />
    </div>
  );
};

export default PatientAIInsightsTab;
