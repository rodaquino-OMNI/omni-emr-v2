
import React from 'react';
import AIInsights from '@/components/ai/AIInsights';
import VitalsSummary from '@/components/patients/vitals/VitalsSummary';
import { useTranslation } from '@/hooks/useTranslation';

interface InsightsTabProps {
  patientId: string;
  insights: any[];
}

const InsightsTab: React.FC<InsightsTabProps> = ({ patientId, insights }) => {
  const { t } = useTranslation();

  return (
    <>
      {insights.length > 0 ? (
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
