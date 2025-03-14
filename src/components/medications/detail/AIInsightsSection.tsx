
import React from 'react';
import AIInsights from '../../ai/AIInsights';
import { useAIInsights } from '@/hooks/useAIInsights';

interface AIInsightsSectionProps {
  patientId: string;
  medicationId: string;
}

const AIInsightsSection = ({ patientId, medicationId }: AIInsightsSectionProps) => {
  // Get AI insights related to medications for this patient
  const { insights } = useAIInsights(
    patientId, 
    ['medications']
  );
  
  // Only show relevant insights about this specific medication
  const relevantInsights = insights.filter(insight => 
    insight.source === 'medications' && 
    (!insight.relatedTo || insight.relatedTo.type === 'medication')
  );
  
  if (relevantInsights.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <AIInsights insights={relevantInsights} />
    </div>
  );
};

export default AIInsightsSection;
