
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

// Import types
import { EmergencyTriageWorkflowProps } from './types';

// Import components
import PatientInfo from './triage/PatientInfo';
import VitalSigns from './triage/VitalSigns';
import TriageLevelSelector from './triage/TriageLevel';
import CurrentTriageLevel from './triage/CurrentTriageLevel';
import EmergencyTreatment from './triage/EmergencyTreatment';
import PermissionMessage from './triage/PermissionMessage';

// Import hooks
import { useTriageState } from './hooks/useTriageState';

const EmergencyTriageWorkflow = ({ patientId, patientName }: EmergencyTriageWorkflowProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const permissions = usePermissions(user);
  
  // Check permissions
  const canPerformTriage = permissions.canPerformTriage();
  const canTreatEmergency = permissions.checkEmergencyCare('treatment');
  const isPhysician = user?.role === 'doctor';
  const isNurse = user?.role === 'nurse';
  
  // Use the custom hook to manage triage state
  const {
    triageLevel,
    chiefComplaint,
    setChiefComplaint,
    vitals,
    handleTriageSubmit,
    handleInitiateTreatment,
    handleVitalSignsUpdate
  } = useTriageState(patientId, patientName);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('emergencyTriage')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Patient Information */}
            <PatientInfo 
              patientName={patientName}
              patientId={patientId}
              chiefComplaint={chiefComplaint}
              setChiefComplaint={setChiefComplaint}
              canPerformTriage={canPerformTriage}
            />
            
            {/* Vital Signs */}
            <VitalSigns 
              vitals={vitals}
              canPerformTriage={canPerformTriage}
              onUpdateVitals={handleVitalSignsUpdate}
            />
            
            {/* Triage Levels */}
            <TriageLevelSelector
              onTriageSubmit={handleTriageSubmit}
              canPerformTriage={canPerformTriage}
            />
            
            {/* Current Triage Level */}
            <CurrentTriageLevel triageLevel={triageLevel} />
            
            {/* Emergency Treatment Actions */}
            <EmergencyTreatment
              canTreatEmergency={canTreatEmergency}
              isPhysician={isPhysician}
              onInitiateTreatment={handleInitiateTreatment}
            />
            
            {/* Permission Messages */}
            <PermissionMessage
              canPerformTriage={canPerformTriage}
              canTreatEmergency={canTreatEmergency}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyTriageWorkflow;
