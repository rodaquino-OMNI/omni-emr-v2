
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
  // Fix: Extract the boolean value directly instead of providing the function
  const permissions = usePermissions(user);
  const canManageVitals = permissions.canManagePatientFluidBalance();
  
  // Get AI insights specifically for vitals
  const { insights } = useAIInsights(patientId, ['vitals']);
  
  // Mock function for recording vitals - in a real app this would connect to Supabase
  const recordVitals = async () => {
    toast.success(t('vitalSignsRecorded'), {
      description: t('vitalSignsRecordedDescription')
    });
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
        insights={insights}
      />
    </div>
  );
};

export default PatientVitals;
