import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Activity, FileText, Pill, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Patient, AIInsight } from '@/types/patient';
import { 
  PatientOverviewTab, 
  PatientVitalSignsTab, 
  PatientRecordsTab, 
  PatientPrescriptionsTab,
  PatientAIInsightsTab
} from '@/components/patients/tabs';
import { adaptToComponentAIInsight } from '@/utils/typeAdapters';

interface DoctorPatientViewProps {
  patient: Patient;
  patientId: string;
}

const DoctorPatientView: React.FC<DoctorPatientViewProps> = ({ 
  patient, 
  patientId 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goBack = () => {
    navigate('/patients');
  };

  // Check if there are critical insights to show a warning badge
  const hasCriticalInsights = patient.insights?.some(
    insight => 'severity' in insight ? 
      insight.severity === 'high' : 
      insight.type === 'critical'
  );

  // Convert patient insights to AIInsight format for the PatientAIInsightsTab
  const patientInsights: AIInsight[] = patient.insights?.map(insight => {
    if ('patient_id' in insight) {
      // If it's already an AIInsight, return it as is
      return insight as AIInsight;
    }
    
    // Otherwise, convert it to AIInsight format
    return {
      id: insight.id,
      patient_id: patientId,
      title: insight.title,
      content: insight.content,
      category: 'general',
      severity: insight.type === 'critical' ? 'high' : 
                insight.type === 'warning' ? 'medium' : 'low',
      created_at: insight.timestamp || new Date().toISOString()
    };
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t('backToPatients')}
        </Button>
        <Button variant="outline">{t('editPatient')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {patient.first_name} {patient.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('patientId')}</p>
              <p>{patient.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('dateOfBirth')}</p>
              <p>{patient.date_of_birth}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('gender')}</p>
              <p>{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('status')}</p>
              <p>{patient.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="vitals">
            <Activity className="mr-2 h-4 w-4" />
            {t('vitals')}
          </TabsTrigger>
          <TabsTrigger value="records">
            <FileText className="mr-2 h-4 w-4" />
            {t('records')}
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <Pill className="mr-2 h-4 w-4" />
            {t('prescriptions')}
          </TabsTrigger>
          <TabsTrigger value="ai_insights">
            <AlertCircle className="mr-2 h-4 w-4" />
            {t('aiInsights')}
            {hasCriticalInsights && (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">!</span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <PatientOverviewTab patientId={patientId} patient={patient} />
        </TabsContent>
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        <TabsContent value="records">
          <PatientRecordsTab patientId={patientId} />
        </TabsContent>
        <TabsContent value="prescriptions">
          <PatientPrescriptionsTab patientId={patientId} />
        </TabsContent>
        <TabsContent value="ai_insights">
          <PatientAIInsightsTab 
            patientId={patientId} 
            insights={patientInsights} 
            isLoading={false} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorPatientView;
