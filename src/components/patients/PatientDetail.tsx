
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatient } from '@/hooks/usePatient';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { adaptToComponentAIInsight } from '@/utils/typeAdapters';
import { 
  PatientOverviewTab,
  PatientRecordsTab,
  PatientPrescriptionsTab,
  PatientAIInsightsTab
} from './tabs';

interface PatientDetailProps {}

const PatientDetail: React.FC<PatientDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { patient, isLoading, error } = usePatient(id || '');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !patient) {
    return <div>Error: {error || 'Patient not found'}</div>;
  }

  // Convert patient insights to the format expected by PatientAIInsightsTab
  const adaptedInsights = patient.insights ? 
    patient.insights.map(insight => adaptToComponentAIInsight(insight)) : 
    [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {patient.first_name} {patient.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t('patientId')}
              </p>
              <p>{patient.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('dateOfBirth')}
              </p>
              <p>{patient.date_of_birth}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="records">{t('records')}</TabsTrigger>
          <TabsTrigger value="prescriptions">{t('prescriptions')}</TabsTrigger>
          <TabsTrigger value="ai_insights">{t('aiInsights')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <PatientOverviewTab patientId={id || ''} patient={patient} />
        </TabsContent>
        <TabsContent value="records">
          <PatientRecordsTab patientId={id || ''} />
        </TabsContent>
        <TabsContent value="prescriptions">
          <PatientPrescriptionsTab patientId={id || ''} />
        </TabsContent>
        <TabsContent value="ai_insights">
          <PatientAIInsightsTab 
            patientId={id || ''} 
            insights={patient.insights || []}
            isLoading={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
