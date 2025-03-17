
import React from 'react';
import { AIInsight } from '@/components/ai/AIInsights';
import { EmptyState } from '@/components/ui/empty-state';
import { AIInsight as PatientInsight } from '@/types/patient';
import { adaptToComponentAIInsight } from '@/utils/typeAdapters';
import { useTranslation } from '@/hooks/useTranslation';

interface PatientAIInsightsTabProps {
  patientId: string;
  insights?: PatientInsight[] | AIInsight[];
  isLoading?: boolean;
}

const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({
  patientId,
  insights = [],
  isLoading = false,
}) => {
  const { t } = useTranslation();

  // Determine if insights are already in the component format or need conversion
  const isPatientInsightType = (insight: PatientInsight | AIInsight): insight is PatientInsight => {
    return 'severity' in insight && !('type' in insight);
  };

  // Convert PatientInsight to ComponentAIInsight if needed
  const adaptedInsights = insights.map(insight => {
    if (isPatientInsightType(insight)) {
      return adaptToComponentAIInsight(insight);
    }
    // Already in ComponentAIInsight format - ensure patient_id is set
    return {
      ...insight,
      patient_id: patientId || insight.patient_id
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
      {adaptedInsights.map(insight => (
        <AIInsight 
          key={insight.id}
          id={insight.id}
          title={insight.title}
          description={insight.description}
          type={insight.type}
          source={insight.source}
          timestamp={insight.timestamp}
          patient_id={insight.patient_id}
        />
      ))}
      {isLoading && (
        <div className="p-4 text-center">
          <span className="animate-pulse">{t('loading', 'Loading insights...')}</span>
        </div>
      )}
    </div>
  );
};

export default PatientAIInsightsTab;
