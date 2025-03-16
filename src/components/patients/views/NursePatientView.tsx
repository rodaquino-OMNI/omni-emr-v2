
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientContext } from '@/context/PatientContext';
import PatientOverviewTab from '@/components/patients/tabs/PatientOverviewTab';
import PatientRecordsTab from '@/components/patients/tabs/PatientRecordsTab';
import PatientVitalSignsTab from '@/components/patients/tabs/PatientVitalSignsTab';
import AIInsights from '@/components/ai/AIInsights';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import NewVisitNoteForm from '@/components/visit-notes/NewVisitNoteForm';

interface NursePatientViewProps {
  patientId: string;
}

const NursePatientView: React.FC<NursePatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error, refreshPatient } = usePatientContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVisitNoteDialogOpen, setIsVisitNoteDialogOpen] = useState(false);
  
  // Get the active tab from URL or default to overview
  const activeTab = searchParams.get('tab') || 'overview';
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    setSearchParams(newParams);
  };
  
  // Filter nurse-relevant insights
  const nurseInsights = patient?.insights?.filter(insight => 
    insight.type === 'critical' || 
    insight.severity === 'critical' || 
    insight.category === 'vitals' ||
    insight.category === 'nurse'
  ) || [];
  
  const hasNurseInsights = nurseInsights.length > 0;
  
  if (isLoading) {
    return <div>Loading patient data...</div>;
  }
  
  if (error || !patient) {
    return <div>Error loading patient: {error}</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Nursing Actions */}
      <div className="flex justify-end gap-2">
        <Dialog open={isVisitNoteDialogOpen} onOpenChange={setIsVisitNoteDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              {t('newVisitNote')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <NewVisitNoteForm 
              onClose={() => setIsVisitNoteDialogOpen(false)}
              onSuccess={refreshPatient}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Display nurse-relevant insights */}
      {hasNurseInsights && (
        <AIInsights 
          insights={nurseInsights}
          className="animate-pulse-subtle"
        />
      )}
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="records">{t('records')}</TabsTrigger>
          <TabsTrigger value="vitalsigns">{t('vitalSigns')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-4">
          <PatientOverviewTab 
            patientId={patientId} 
            insights={patient.insights || []} 
            prescriptions={patient.prescriptions || []} 
          />
        </TabsContent>
        
        <TabsContent value="records" className="space-y-6 mt-4">
          <PatientRecordsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="vitalsigns" className="space-y-6 mt-4">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NursePatientView;
