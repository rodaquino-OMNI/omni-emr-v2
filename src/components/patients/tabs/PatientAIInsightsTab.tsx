
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, RotateCcw } from 'lucide-react';
import { AIInsight as PatientAIInsight } from '@/types/patient';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';
import { adaptAIInsight } from '@/utils/typeAdapters';

export interface PatientAIInsightsTabProps {
  patientId: string;
  insights: PatientAIInsight[];
  isLoading: boolean;
}

export const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({
  patientId,
  insights,
  isLoading
}) => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter insights based on the active tab
  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(insight => insight.severity === activeTab);
  
  // Count insights by severity
  const criticalCount = insights.filter(insight => insight.severity === 'critical').length;
  const warningCount = insights.filter(insight => insight.severity === 'high').length;
  const infoCount = insights.filter(insight => insight.severity === 'low').length;
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }
  
  // Handle refresh insights
  const handleRefresh = () => {
    console.log('Refreshing insights for patient:', patientId);
    // Implement refresh logic here
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('aiInsights', 'AI Insights')}</CardTitle>
          <CardDescription>
            {t('aiInsightsDescription', 'AI-generated insights and suggestions for this patient')}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('refresh', 'Refresh')}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {t('filter', 'Filter')}
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('generateInsight', 'Generate')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
            <TabsTrigger value="all">
              {t('all', 'All')} 
              <Badge variant="secondary" className="ml-2">{insights.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="critical">
              {t('critical', 'Critical')}
              <Badge variant="destructive" className="ml-2">{criticalCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="high">
              {t('warnings', 'Warnings')}
              <Badge variant="warning" className="ml-2">{warningCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="low">
              {t('info', 'Info')}
              <Badge variant="outline" className="ml-2">{infoCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {insights.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {t('noInsights', 'No insights available for this patient')}
                </p>
                <Button variant="outline" className="mt-4">
                  {t('generateNewInsight', 'Generate New Insight')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInsights.map((insight) => (
                  <AIInsightCard 
                    key={insight.id} 
                    insight={adaptAIInsight(insight)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="critical" className="mt-0">
            {criticalCount === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {t('noCriticalInsights', 'No critical insights')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInsights.map((insight) => (
                  <AIInsightCard 
                    key={insight.id} 
                    insight={adaptAIInsight(insight)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="high" className="mt-0">
            {warningCount === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {t('noWarningInsights', 'No warning insights')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInsights.map((insight) => (
                  <AIInsightCard 
                    key={insight.id} 
                    insight={adaptAIInsight(insight)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="low" className="mt-0">
            {infoCount === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {t('noInfoInsights', 'No informational insights')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInsights.map((insight) => (
                  <AIInsightCard 
                    key={insight.id} 
                    insight={adaptAIInsight(insight)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Separator className="my-6" />
        
        <div className="text-sm text-muted-foreground">
          <p>
            {t('aiDisclaimer', 'AI insights are generated automatically and should be reviewed by a healthcare professional')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
