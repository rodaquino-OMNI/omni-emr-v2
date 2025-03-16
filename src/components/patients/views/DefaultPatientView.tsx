
import React from 'react';
import { usePatientContext } from '@/context/PatientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientOverviewTab from '@/components/patients/tabs/PatientOverviewTab';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

interface DefaultPatientViewProps {
  patientId: string;
}

const DefaultPatientView: React.FC<DefaultPatientViewProps> = ({ patientId }) => {
  const { patient, isLoading } = usePatientContext();
  const { t } = useTranslation();
  
  if (isLoading) {
    return <div>Loading patient data...</div>;
  }
  
  if (!patient) {
    return <div>No patient data available</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('patientInformation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="history">{t('history')}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 mt-4">
              <PatientOverviewTab 
                patientId={patientId} 
                insights={patient.insights || []}
                prescriptions={patient.prescriptions || []}
              />
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <p className="text-muted-foreground">
                {t('patientHistoryComingSoon')}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefaultPatientView;
