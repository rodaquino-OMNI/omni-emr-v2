
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Removed Sidebar and Header imports as they're already provided by the Layout component
import { usePatientData } from '@/hooks/usePatientData';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import { usePatientPrescriptions } from '@/components/patients/hooks/usePatientPrescriptions';
import PatientDetailHeader from '@/components/patients/detail/PatientDetailHeader';
import PatientDetailLoader from '@/components/patients/detail/PatientDetailLoader';
import PatientViewSelector from '@/components/patients/PatientViewSelector';
import { mapToPatientStatus } from '@/types/patientTypes';
import { useSectorContext } from '@/hooks/useSectorContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { PatientProvider } from '@/context/PatientContext';
import { Patient, PrescriptionItem } from '@/types/patient';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useTranslation();
  
  // Get the sector context
  const { selectedSector, assignPatient, unassignPatient } = useSectorContext();
  
  // Get the patient ID from params
  const patientId = id || '';
  
  // Fetch patient data using our custom hook
  const { patient, isLoading: patientLoading } = usePatientData(patientId);
  
  // Fetch insights data
  const { insights, isLoading: insightsLoading } = usePatientInsights(patientId);
  
  // Fetch prescriptions data
  const { prescriptions, loading: prescriptionsLoading } = usePatientPrescriptions(patientId);

  // Handle assignment toggle
  const handleAssignmentToggle = async () => {
    if (!patient || !selectedSector) return;
    
    try {
      if (patient.is_assigned) {
        await unassignPatient(patient.id);
        toast.success(language === 'pt' ? 'Paciente desatribuído com sucesso' : 'Patient unassigned successfully');
      } else {
        await assignPatient(patient.id);
        toast.success(language === 'pt' ? 'Paciente atribuído com sucesso' : 'Patient assigned successfully');
      }
    } catch (error) {
      console.error('Error toggling assignment:', error);
      toast.error(
        language === 'pt' ? 'Erro ao atualizar a atribuição' : 'Error updating assignment'
      );
    }
  };
  
  // Loading state
  if (patientLoading) return <PatientDetailLoader />;
  
  // Error state for patient not found
  if (!patient) return (
    <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-6xl mx-auto w-full">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate('/patients')}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === 'pt' ? 'Voltar para pacientes' : 'Back to patients'}
            </Button>
            
            <div className="glass-card p-6 text-center">
              <h2 className="text-xl font-bold text-red-500">
                {language === 'pt' ? 'Paciente não encontrado' : 'Patient not found'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {language === 'pt' 
                  ? 'O paciente solicitado não pôde ser encontrado.' 
                  : 'The requested patient could not be found.'}
              </p>
            </div>
          </div>
        </div>
  );
  
  // Check for critical insights
  const hasCriticalInsights = insights?.some(insight => 
    typeof insight === 'object' && 
    'severity' in insight && 
    insight.severity === 'critical'
  ) || false;
  
  // Ensure prescriptions have the required type property
  const fixedPrescriptions = prescriptions?.map(prescription => ({
    ...prescription,
    items: prescription.items?.map((item: PrescriptionItem & {type?: string}) => ({
      ...item,
      type: item.type || 'medication' // Ensure type property exists
    })) || []
  })) || [];
  
  // Ensure patient has the correct status type and fixed prescriptions
  const patientWithValidStatus = {
    ...patient,
    status: mapToPatientStatus(patient.status?.toString() || 'stable'),
    insights: insights || [],
    prescriptions: fixedPrescriptions
  } as Patient;
  
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="space-y-4">
          <div className="space-y-4 max-w-6xl mx-auto">
            {/* Patient header with back button */}
            <PatientDetailHeader
              patient={patientWithValidStatus}
              hasCriticalInsights={hasCriticalInsights}
              onAssignmentToggle={handleAssignmentToggle}
            />
            
            {/* Patient context provider with role-based views */}
            <PatientProvider patientId={patientId}>
              <PatientViewSelector patientId={patientId} />
            </PatientProvider>
          </div>
      </div>
    </div>
  );
};

export default PatientDetail;
