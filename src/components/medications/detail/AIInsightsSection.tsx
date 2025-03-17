
import React from 'react';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import { Card } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import AIInsights from '@/components/ai/AIInsights';
import { useTranslation } from '@/hooks/useTranslation';

interface AIInsightsSectionProps {
  patientId: string;
  medicationId: string;
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ 
  patientId, 
  medicationId 
}) => {
  const { t } = useTranslation();
  const { insights, isLoading } = usePatientInsights(patientId, ['medications']);
  
  // Filter only medication-related insights
  const medicationInsights = insights.filter(insight => 
    insight.category === 'medications'
  );

  if (isLoading) {
    return (
      <Card className="p-4 mb-4 bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <h3 className="text-sm font-medium">{t('medicationInsights')}</h3>
        </div>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (medicationInsights.length === 0) {
    return null; // Don't show section if no insights
  }

  return (
    <Card className="p-4 mb-4 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900">
      <AIInsights 
        insights={medicationInsights}
        showSource
        compact
      />
    </Card>
  );
};

export default AIInsightsSection;
