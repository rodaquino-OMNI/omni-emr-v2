
import React from 'react';
import { usePatientInsights, PatientInsight } from '@/hooks/usePatientInsights';
import AIInsights, { InsightType, AIInsight } from '../ai/AIInsights';
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
  const mappedInsights: AIInsight[] = insights
    .map(insight => ({
      id: insight.id,
      type: mapSeverityToType(insight.severity),
      source: mapCategoryToSource(insight.category),
      title: insight.title,
      description: insight.description,
      relatedTo: insight.metadata?.id ? {
        type: insight.category,
        id: insight.metadata.id
      } : undefined,
      timestamp: new Date(insight.created_at)
    }))
    .slice(0, maxItems);

  // Helper function to map severity to InsightType
  function mapSeverityToType(severity: string): InsightType {
    switch (severity) {
      case 'critical': return 'critical';
      case 'warning': return 'warning';
      case 'positive': return 'positive';
      default: return 'info';
    }
  }

  // Helper function to map category to source
  function mapCategoryToSource(category: string): 'vitals' | 'labs' | 'medications' | 'tasks' | 'general' {
    switch (category) {
      case 'vitals': return 'vitals';
      case 'lab': 
      case 'labs': return 'labs';
      case 'medications': return 'medications';
      case 'tasks': return 'tasks';
      default: return 'general';
    }
  }

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
