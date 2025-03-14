
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import CurrentVitalsTab from './tabs/CurrentVitalsTab';
import TrendsTab from './tabs/TrendsTab';
import InsightsTab from './tabs/InsightsTab';

interface PatientVitalsTabsProps {
  patientId: string;
  insights: any[];
}

const PatientVitalsTabs: React.FC<PatientVitalsTabsProps> = ({ patientId, insights }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('current');

  return (
    <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
        <TabsTrigger value="current">{t('currentVitals')}</TabsTrigger>
        <TabsTrigger value="trends">{t('trends')}</TabsTrigger>
        <TabsTrigger value="insights">{t('insights')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="current" className="space-y-4">
        <CurrentVitalsTab patientId={patientId} />
      </TabsContent>
      
      <TabsContent value="trends" className="space-y-4">
        <TrendsTab patientId={patientId} />
      </TabsContent>
      
      <TabsContent value="insights">
        <InsightsTab patientId={patientId} insights={insights} />
      </TabsContent>
    </Tabs>
  );
};

export default PatientVitalsTabs;
