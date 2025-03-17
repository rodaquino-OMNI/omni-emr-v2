
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { usePatientData } from '@/hooks/usePatientData';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate } from 'react-router-dom';
import { Plus, FilePlus2, Stethoscope, Pill } from 'lucide-react';
import PatientHeader from '../detail/PatientDetailHeader';
import PatientVitalSignsTab from '../tabs/PatientVitalSignsTab';
import PatientDiagnosesTab from '../tabs/PatientDiagnosesTab';
import PatientMedicationsTab from '../tabs/PatientMedicationsTab';
import PatientNotesTab from '../tabs/PatientNotesTab';
import PatientLabResultsTab from '../tabs/PatientLabResultsTab';
import PatientImagingTab from '../tabs/PatientImagingTab';
import { PatientAIInsightsTab } from '../tabs';
import { usePatientInsights } from '@/hooks/usePatientInsights';

interface DoctorPatientViewProps {
  patientId: string;
}

const DoctorPatientView: React.FC<DoctorPatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error } = usePatientData(patientId);
  const { insights, isLoading: insightsLoading } = usePatientInsights(patientId);
  const navigate = useNavigate();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !patient) {
    return <div className="p-4 text-red-500">Error loading patient: {error?.toString()}</div>;
  }
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={() => navigate(`/patients/${patientId}/encounter/new`)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Encounter
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/clinical-documentation/new?patientId=${patientId}`)}
          className="flex items-center"
        >
          <FilePlus2 className="h-4 w-4 mr-2" />
          New Note
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/patients/${patientId}/assess`)}
          className="flex items-center"
        >
          <Stethoscope className="h-4 w-4 mr-2" />
          Clinical Assessment
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/prescribe?patientId=${patientId}`)}
          className="flex items-center"
        >
          <Pill className="h-4 w-4 mr-2" />
          Prescribe
        </Button>
      </div>
      
      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList className="flex overflow-x-auto pb-px">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="diagnoses">
          <PatientDiagnosesTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="medications">
          <PatientMedicationsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="notes">
          <PatientNotesTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="labs">
          <PatientLabResultsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="imaging">
          <PatientImagingTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="insights">
          <PatientAIInsightsTab 
            patientId={patientId} 
            insights={insights} 
            isLoading={insightsLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorPatientView;
