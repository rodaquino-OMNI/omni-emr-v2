
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { usePatient } from '@/hooks/usePatient';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, ActivitySquare, Calendar } from 'lucide-react';
import PatientHeader from '../detail/PatientDetailHeader';
import PatientVitalSignsTab from '../tabs/PatientVitalSignsTab';
import PatientNotesTab from '../tabs/PatientNotesTab';
import PatientAppointmentsTab from '../tabs/PatientAppointmentsTab';
import PatientAllergiesTab from '../tabs/PatientAllergiesTab';
import PatientMedicationsTab from '../tabs/PatientMedicationsTab';

interface MedicalStaffPatientViewProps {
  patientId: string;
}

const MedicalStaffPatientView: React.FC<MedicalStaffPatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error } = usePatient(patientId);
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
          onClick={() => navigate(`/patients/${patientId}/vitals/new`)}
          className="flex items-center"
        >
          <ActivitySquare className="h-4 w-4 mr-2" />
          Record Vitals
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/clinical-documentation/new?patientId=${patientId}&type=progress_note`)}
          className="flex items-center"
        >
          <FilePlus2 className="h-4 w-4 mr-2" />
          Progress Note
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/appointments/new?patientId=${patientId}`)}
          className="flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>
      
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="flex overflow-x-auto pb-px">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PatientVitalSignsTab patientId={patientId} compact />
            <PatientAllergiesTab patientId={patientId} compact />
            <PatientMedicationsTab patientId={patientId} compact />
            <PatientAppointmentsTab patientId={patientId} compact />
          </div>
        </TabsContent>
        
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="medications">
          <PatientMedicationsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="allergies">
          <PatientAllergiesTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="appointments">
          <PatientAppointmentsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="notes">
          <PatientNotesTab patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalStaffPatientView;
