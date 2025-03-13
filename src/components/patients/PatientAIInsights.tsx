
import React from 'react';
import AIInsights, { AIInsight } from '../ai/AIInsights';

type PatientAIInsightsProps = {
  insights: AIInsight[];
  loading: boolean;
};

const PatientAIInsights = ({ insights, loading }: PatientAIInsightsProps) => {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-medium mb-4">AI Clinical Insights</h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">Analyzing patient data...</p>
        </div>
      ) : insights.length > 0 ? (
        <AIInsights insights={insights} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No insights available for this patient at this time.
        </div>
      )}
    </div>
  );
};

export default PatientAIInsights;
