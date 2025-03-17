
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
  
  // Filter only medication-related insights that match the current medication
  const medicationInsights = insights.filter(insight => 
    insight.category === 'medications' && 
    (!insight.metadata?.id || insight.metadata.id === medicationId)
  );

  // Map PatientInsight to AIInsight
  const mappedInsights = medicationInsights.map(insight => ({
    id: insight.id,
    type: insight.severity === 'critical' ? 'critical' : 
          insight.severity === 'warning' ? 'warning' : 'info',
    source: insight.category as 'medications' | 'vitals' | 'labs' | 'tasks' | 'general',
    title: insight.title,
    description: insight.description,
    relatedTo: insight.metadata?.id ? {
      type: insight.category,
      id: insight.metadata.id
    } : undefined,
    timestamp: new Date(insight.created_at)
  }));

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

  if (mappedInsights.length === 0) {
    return null; // Don't show section if no insights for this specific medication
  }

  return (
    <Card className="p-4 mb-4 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900">
      <AIInsights 
        insights={mappedInsights}
        showSource
        compact
      />
    </Card>
  );
};

export default AIInsightsSection;
