
import React from 'react';
import { usePatientInsights, PatientInsight } from '@/hooks/usePatientInsights';
import AIInsights from '../ai/AIInsights';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';

type PatientAIInsightsProps = {
  patientId: string;
  categories?: string[];
  maxItems?: number;
};

const PatientAIInsights = ({ 
  patientId, 
  categories,
  maxItems
}: PatientAIInsightsProps) => {
  const { t } = useTranslation();
  const { insights, isLoading } = usePatientInsights(patientId, categories);

  // Map our PatientInsights to the AI Insights format
  const mappedInsights = insights
    .map(insight => ({
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
    }))
    .slice(0, maxItems);

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-medium mb-4">{t('aiClinicalInsights')}</h2>
      
      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
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
