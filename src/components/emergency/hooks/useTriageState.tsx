
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { TriageLevel } from '../types';
import { VitalSignsData } from '../triage/VitalSigns';

export function useTriageState(patientId: string, patientName: string) {
  const { t } = useTranslation();
  const [triageLevel, setTriageLevel] = useState<TriageLevel | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState<string>('');
  const [vitals, setVitals] = useState<VitalSignsData>({
    heartRate: 85,
    respiratoryRate: 18,
    bloodPressure: '120/80',
    temperature: 37.0,
    painLevel: 3,
    oxygenSaturation: 98
  });

  // Function to handle triage submission
  const handleTriageSubmit = (level: TriageLevel) => {
    setTriageLevel(level);
    
    toast.success(t('triageLevelAssigned'), {
      description: t('patientHasBeenTriaged')
    });
  };
  
  // Function to handle emergency treatment initiation
  const handleInitiateTreatment = () => {
    if (!triageLevel) {
      toast.error(t('triageRequired'), {
        description: t('mustAssignTriageLevelFirst')
      });
      return;
    }
    
    toast.success(t('treatmentInitiated'), {
      description: t('emergencyTreatmentStarted')
    });
  };
  
  // Function to handle vital signs update
  const handleVitalSignsUpdate = () => {
    // In a real app, this would open a form to update vital signs
    toast.success(t('vitalSignsRecorded'), {
      description: t('vitalSignsUpdated')
    });
  };

  return {
    triageLevel,
    chiefComplaint,
    setChiefComplaint,
    vitals,
    handleTriageSubmit,
    handleInitiateTreatment,
    handleVitalSignsUpdate
  };
}
