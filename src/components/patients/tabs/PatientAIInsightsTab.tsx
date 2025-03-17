
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComponentAIInsight, adaptToComponentAIInsight } from '@/utils/typeAdapters';
import { AIInsight, PatientInsight } from '@/types/patient';
import { Skeleton } from '@/components/ui/skeleton';

export interface PatientAIInsightsTabProps {
  patientId: string;
  insights: (AIInsight | PatientInsight)[];
  isLoading: boolean;
  onRefresh?: () => void;
  onGenerateInsight?: () => void;
  onActionInsight?: (id: string, action: string) => void;
  onDismissInsight?: (id: string) => void;
}

const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({
  patientId,
  insights = [],
  isLoading = false,
  onRefresh,
  onGenerateInsight,
  onActionInsight,
  onDismissInsight
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [insightComponents, setInsightComponents] = useState<ComponentAIInsight[]>([]);
  
  useEffect(() => {
    // Convert insights to component format
    const convertedInsights = insights.map(insight => adaptToComponentAIInsight(insight));
    setInsightComponents(convertedInsights);
  }, [insights]);

  const filteredInsights = React.useMemo(() => {
    if (activeTab === 'all') {
      return insightComponents;
    }
    return insightComponents.filter(insight => insight.type === activeTab);
  }, [insightComponents, activeTab]);

  if (isLoading) {
    return <InsightsLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">AI Insights & Suggestions</h3>
        <div className="flex gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
          {onGenerateInsight && (
            <Button size="sm" onClick={onGenerateInsight}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Generate New Insight
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="warning">Warnings</TabsTrigger>
          <TabsTrigger value="info">Informational</TabsTrigger>
          <TabsTrigger value="success">Positive</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredInsights.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {filteredInsights.map(insight => (
                <AIInsightCard
                  key={insight.id}
                  insight={insight}
                  onDismiss={onDismissInsight}
                  onAction={onActionInsight}
                />
              ))}
            </div>
          ) : (
            <EmptyInsightsState
              activeTab={activeTab}
              onGenerate={onGenerateInsight}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyInsightsState: React.FC<{
  activeTab: string;
  onGenerate?: () => void;
}> = ({ activeTab, onGenerate }) => {
  const getMessage = () => {
    switch (activeTab) {
      case 'critical':
        return "No critical insights available";
      case 'warning':
        return "No warnings available";
      case 'info':
        return "No informational insights available";
      case 'success':
        return "No positive insights available";
      default:
        return "No insights available for this patient";
    }
  };

  return (
    <Card className="border-dashed border-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-muted-foreground">
          {getMessage()}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        {onGenerate && (
          <Button onClick={onGenerate} variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            Generate New Insight
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const InsightsLoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-9 w-24" />
    </div>
    <Skeleton className="h-10 w-full mb-4" />
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="border">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PatientAIInsightsTab;
