
import React from 'react';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import AIInsights from '@/components/ai/AIInsights';
import VitalsSummary from '@/components/patients/vitals/VitalsSummary';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';

interface InsightsTabProps {
  patientId: string;
}

const InsightsTab: React.FC<InsightsTabProps> = ({ patientId }) => {
  const { t } = useTranslation();
  const { insights, isLoading } = usePatientInsights(patientId, ['vitals']);

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
    <>
      {isLoading ? (
        <div className="glass-card p-6 text-center">
          <div className="flex justify-center items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-muted-foreground">{t('loadingInsights')}</p>
          </div>
        </div>
      ) : mappedInsights && mappedInsights.length > 0 ? (
        <AIInsights 
          insights={mappedInsights}
          showSource={false}
        />
      ) : (
        <div className="glass-card p-6 text-center">
          <p className="text-muted-foreground">{t('noInsightsAvailable')}</p>
        </div>
      )}
      
      <div className="glass-card p-4 mt-4">
        <VitalsSummary />
      </div>
    </>
  );
};

export default InsightsTab;
