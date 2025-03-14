
import React from 'react';
import AIInsights from '@/components/ai/AIInsights';
import VitalsSummary from '@/components/patients/vitals/VitalsSummary';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';

interface InsightsTabProps {
  patientId: string;
  insights: any[];
  isLoading?: boolean;
}

const InsightsTab: React.FC<InsightsTabProps> = ({ patientId, insights, isLoading = false }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="flex justify-center items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('loadingInsights')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {insights && insights.length > 0 ? (
        <AIInsights 
          insights={insights}
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
