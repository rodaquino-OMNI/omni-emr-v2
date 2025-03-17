
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface PatientAIInsightsTabProps {
  patientId: string;
}

const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({ patientId }) => {
  const { insights, loading } = usePatientInsights(patientId);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <Info className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No AI Insights Available</h3>
            <p className="text-muted-foreground">
              There are currently no AI-generated insights for this patient.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group insights by type
  const criticalInsights = insights.filter(insight => insight.severity === 'critical');
  const warningInsights = insights.filter(insight => insight.severity === 'warning');
  const informationalInsights = insights.filter(insight => insight.severity === 'info');

  return (
    <div className="space-y-6">
      {criticalInsights.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-red-50 rounded-md border border-red-100">
                  <h4 className="font-medium text-red-700">{insight.title}</h4>
                  <p className="text-sm text-red-600">{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-sm font-medium mt-2 text-red-700">
                      Recommendation: {insight.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {warningInsights.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warningInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-amber-50 rounded-md border border-amber-100">
                  <h4 className="font-medium text-amber-700">{insight.title}</h4>
                  <p className="text-sm text-amber-600">{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-sm font-medium mt-2 text-amber-700">
                      Recommendation: {insight.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {informationalInsights.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Informational Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {informationalInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-sm font-medium mt-2">
                      Recommendation: {insight.recommendation}
                    </p>
                  )}
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
