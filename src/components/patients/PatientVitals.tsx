
import React from 'react';
import { useAIInsights } from '@/hooks/useAIInsights';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import VitalsHeader from './vitals/VitalsHeader';
import PatientVitalsTabs from './vitals/PatientVitalsTabs';
import { getPatientName } from './vitals/helpers/patientHelper';

type PatientVitalsProps = {
  patientId: string;
};

const PatientVitals = ({ patientId }: PatientVitalsProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  // Extract the permissions object
  const permissions = usePermissions(user);
  // Get the boolean value directly by calling the function
  const canManageVitals = permissions.canManagePatientFluidBalance();
  
  // Get AI insights specifically for vitals
  const { insights, loading: insightsLoading } = useAIInsights(patientId, ['vitals']);
  
  // Mock function for recording vitals - in a real app this would connect to Supabase
  const recordVitals = async () => {
    try {
      // Simulate a server request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success(t('vitalSignsRecorded'), {
        description: t('vitalSignsRecordedDescription')
      });
    } catch (error) {
      console.error('Error recording vitals:', error);
      toast.error(t('errorRecordingVitals'), {
        description: t('errorRecordingVitalsDescription')
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <VitalsHeader 
        patientName={getPatientName(patientId)}
        canManageVitals={canManageVitals}
        onRecordVitals={recordVitals}
      />
      
      <PatientVitalsTabs 
        patientId={patientId} 
        insights={insights || []}
        insightsLoading={insightsLoading}
      />
    </div>
  );
};

export default PatientVitals;
