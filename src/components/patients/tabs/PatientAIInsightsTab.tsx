
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps, AIInsight } from '@/types/patient';
import { Brain, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

interface PatientAIInsightsTabProps extends PatientTabProps {
  insights?: AIInsight[];
  isLoading?: boolean;
  error?: string | null;
}

const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({ 
  patientId, 
  insights = [], 
  isLoading = false,
  error = null
}) => {
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading AI insights: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <Brain className="h-4 w-4" />
            No AI insights available for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Group insights by severity
  const criticalInsights = insights.filter(insight => insight.severity === 'critical');
  const highInsights = insights.filter(insight => insight.severity === 'high');
  const mediumInsights = insights.filter(insight => insight.severity === 'medium');
  const lowInsights = insights.filter(insight => insight.severity === 'low');
  
  return (
    <div className="space-y-6">
      {criticalInsights.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="pb-2 border-b border-red-100">
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {criticalInsights.map((insight) => (
                <div key={insight.id} className="p-3 bg-red-50 rounded-md">
                  <div className="font-medium text-red-800">{insight.title}</div>
                  <div className="text-sm text-red-700 mt-1">{insight.description}</div>
                  {insight.action_required && (
                    <div className="mt-2 text-sm font-medium text-red-800">
                      Action Required: {insight.action_description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {highInsights.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader className="pb-2 border-b border-amber-100">
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              High Priority Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {highInsights.map((insight) => (
                <div key={insight.id} className="p-3 bg-amber-50 rounded-md">
                  <div className="font-medium text-amber-800">{insight.title}</div>
                  <div className="text-sm text-amber-700 mt-1">{insight.description}</div>
                  {insight.action_required && (
                    <div className="mt-2 text-sm font-medium text-amber-800">
                      Action Required: {insight.action_description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {mediumInsights.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Medium Priority Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mediumInsights.map((insight) => (
                <div key={insight.id} className="p-3 bg-gray-50 rounded-md">
                  <div className="font-medium">{insight.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{insight.description}</div>
                  {insight.action_required && (
                    <div className="mt-2 text-sm font-medium">
                      Action Required: {insight.action_description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {lowInsights.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Low Priority Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowInsights.map((insight) => (
                <div key={insight.id} className="p-3 bg-green-50 rounded-md">
                  <div className="font-medium text-green-800">{insight.title}</div>
                  <div className="text-sm text-green-700 mt-1">{insight.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientAIInsightsTab;
