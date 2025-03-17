
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { usePatientData } from '@/hooks/usePatientData';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate } from 'react-router-dom';
import { FileText, ClipboardList } from 'lucide-react';
import PatientHeader from '../detail/PatientDetailHeader';
import PatientOverviewTab from '../tabs/PatientOverviewTab';
import PatientVitalSignsTab from '../tabs/PatientVitalSignsTab';
import PatientMedicationsTab from '../tabs/PatientMedicationsTab';
import PatientCareTasksTab from '../tabs/PatientCareTasksTab';

interface MedicalStaffPatientViewProps {
  patientId: string;
}

const MedicalStaffPatientView: React.FC<MedicalStaffPatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error } = usePatientData(patientId);
  const navigate = useNavigate();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !patient) {
    return <div className="p-4 text-red-500">Error loading patient: {error?.toString()}</div>;
  }
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} hasCriticalInsights={false} />
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant="outline"
          onClick={() => navigate(`/clinical-documentation/new?patientId=${patientId}&type=clinical_note`)}
          className="flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Clinical Note
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/patients/${patientId}/vitals/new`)}
          className="flex items-center"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          Record Vitals
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex overflow-x-auto pb-px">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="tasks">Care Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <PatientOverviewTab patientId={patientId} patient={patient} />
        </TabsContent>
        
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="medications">
          <PatientMedicationsTab patientId={patientId} readOnly={true} />
        </TabsContent>
        
        <TabsContent value="tasks">
          <PatientCareTasksTab patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalStaffPatientView;
