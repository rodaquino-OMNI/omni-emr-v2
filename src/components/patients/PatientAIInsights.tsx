
import React from 'react';
import { usePatientInsights, PatientInsight } from '@/hooks/usePatientInsights';
import AIInsights from '../ai/AIInsights';
import { useTranslation } from '@/hooks/useTranslation';

type PatientAIInsightsProps = {
  patientId: string;
  categories?: string[];
};

const PatientAIInsights = ({ patientId, categories }: PatientAIInsightsProps) => {
  const { t } = useTranslation();
  const { insights, isLoading } = usePatientInsights(patientId, categories);

  // Map our PatientInsights to the AI Insights format
  const mappedInsights = insights.map(insight => ({
    id: insight.id,
    type: insight.severity === 'critical' ? 'critical' : 
          insight.severity === 'warning' ? 'warning' : 'info',
    source: insight.category as any,
    title: insight.title,
    description: insight.description,
    relatedTo: insight.metadata?.id ? {
      type: insight.category,
      id: insight.metadata.id
    } : undefined,
    timestamp: new Date(insight.created_at)
  }));

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-medium mb-4">{t('aiClinicalInsights')}</h2>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">{t('analyzingPatientData')}</p>
        </div>
      ) : mappedInsights.length > 0 ? (
        <AIInsights insights={mappedInsights} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {t('noInsightsAvailable')}
        </div>
      )}
    </div>
  );
};

export default PatientAIInsights;
