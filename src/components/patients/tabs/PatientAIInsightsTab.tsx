
import React from 'react';
import { AIInsights, AIInsight as ComponentAIInsight } from '@/components/ai/AIInsights';
import { EmptyState } from '@/components/ui/empty-state';
import { AIInsight as PatientInsight } from '@/types/patient';
import { adaptToComponentAIInsight } from '@/utils/typeAdapters';
import { useTranslation } from '@/hooks/useTranslation';

interface PatientAIInsightsTabProps {
  patientId: string;
  insights?: PatientInsight[] | ComponentAIInsight[];
  isLoading?: boolean;
}

const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({
  patientId,
  insights = [],
  isLoading = false,
}) => {
  const { t } = useTranslation();

  // Determine if insights are already in the component format or need conversion
  const isPatientInsightType = (insight: PatientInsight | ComponentAIInsight): insight is PatientInsight => {
    return 'severity' in insight && 'patient_id' in insight;
  };

  // Convert PatientInsight to ComponentAIInsight if needed
  const adaptedInsights = insights.map(insight => {
    if (isPatientInsightType(insight)) {
      return adaptToComponentAIInsight(insight);
    }
    // Already in ComponentAIInsight format - ensure patient_id is set
    return {
      ...insight,
      patient_id: patientId
    };
  });

  if (insights.length === 0 && !isLoading) {
    return (
      <EmptyState
        title={t('noInsightsAvailable', 'No Insights Available')}
        description={t('noInsightsDescription', 'There are no AI insights available for this patient yet.')}
      />
    );
  }

  return (
    <div className="space-y-8">
      <AIInsights insights={adaptedInsights} isLoading={isLoading} />
    </div>
  );
};

export default PatientAIInsightsTab;
