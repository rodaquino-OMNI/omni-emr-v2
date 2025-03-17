
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CircleAlert, BrainCircuit, AlertTriangle, Info } from 'lucide-react';

interface PatientAIInsightsTabProps {
  patientId: string;
  insights?: any[];
  isLoading?: boolean;
}

const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({ 
  patientId, 
  insights = [], 
  isLoading = false 
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!insights || insights.length === 0) {
    return (
      <Alert variant="default" className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <BrainCircuit className="h-4 w-4 text-blue-600" />
        <AlertTitle>No AI Insights Available</AlertTitle>
        <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
          There are currently no AI-generated insights for this patient.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Group insights by severity for display
  const criticalInsights = insights.filter(insight => insight.severity === 'critical');
  const highInsights = insights.filter(insight => insight.severity === 'high');
  const mediumInsights = insights.filter(insight => insight.severity === 'medium');
  const lowInsights = insights.filter(insight => insight.severity === 'low');
  
  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="ml-2">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-orange-500 ml-2">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-amber-500 border-amber-500 ml-2">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-blue-500 border-blue-500 ml-2">Low</Badge>;
      default:
        return null;
    }
  };
  
  const renderInsightIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <CircleAlert className="h-5 w-5 text-destructive flex-shrink-0" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    }
  };
  
  const renderInsightList = (insightsList: any[], title: string) => {
    if (insightsList.length === 0) return null;
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            {title}
            {renderSeverityBadge(insightsList[0].severity)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insightsList.map((insight, index) => (
              <div key={insight.id || index} className="flex gap-3">
                {renderInsightIcon(insight.severity)}
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.action_required && (
                    <div className="mt-2 text-sm font-medium text-destructive">
                      Action required: {insight.action_description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-2">
      {criticalInsights.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Critical Alerts</AlertTitle>
          <AlertDescription>
            {criticalInsights.length} critical insight{criticalInsights.length !== 1 ? 's' : ''} requiring immediate attention.
          </AlertDescription>
        </Alert>
      )}
      
      {renderInsightList(criticalInsights, "Critical Insights")}
      {renderInsightList(highInsights, "High Priority Insights")}
      {renderInsightList(mediumInsights, "Medium Priority Insights")}
      {renderInsightList(lowInsights, "Low Priority Insights")}
    </div>
  );
};

export default PatientAIInsightsTab;
