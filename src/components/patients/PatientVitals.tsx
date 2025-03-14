
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
  const permissions = usePermissions(user);
  
  // Check specifically if the user can manage vital signs
  const canManageVitals = permissions.hasPermission('document_vital_signs');
  const canViewVitals = permissions.hasPermission('view_vitals') || permissions.hasPermission('view_own_vitals');
  
  // Get AI insights specifically for vitals
  const { insights, isLoading } = useAIInsights(patientId, ['vitals']);
  
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
  
  if (!canViewVitals) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">{t('noPermissionToViewVitals')}</p>
      </div>
    );
  }
  
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
        insightsLoading={isLoading}
      />
    </div>
  );
};

export default PatientVitals;
