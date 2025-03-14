
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Activity, Stethoscope, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export type TriageLevel = 'immediate' | 'emergent' | 'urgent' | 'semi-urgent' | 'non-urgent';

interface EmergencyTriageWorkflowProps {
  patientId: string;
  patientName: string;
}

interface VitalSigns {
  heartRate: number;
  respiratoryRate: number;
  bloodPressure: string;
  temperature: number;
  painLevel: number;
  oxygenSaturation: number;
}

const EmergencyTriageWorkflow = ({ patientId, patientName }: EmergencyTriageWorkflowProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const permissions = usePermissions(user);
  
  // Check permissions
  const canPerformTriage = permissions.canPerformTriage();
  const canTreatEmergency = permissions.checkEmergencyCare('treatment');
  const isPhysician = user?.role === 'doctor';
  const isNurse = user?.role === 'nurse';
  
  // State for current triage level and chief complaint
  const [triageLevel, setTriageLevel] = useState<TriageLevel | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState<string>('');
  const [vitals, setVitals] = useState<VitalSigns>({
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
  
  // Get triage level color
  const getTriageLevelColor = (level: TriageLevel) => {
    switch(level) {
      case 'immediate':
        return 'bg-red-500 text-white';
      case 'emergent':
        return 'bg-orange-500 text-white';
      case 'urgent':
        return 'bg-yellow-500 text-white';
      case 'semi-urgent':
        return 'bg-blue-500 text-white';
      case 'non-urgent':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('emergencyTriage')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Patient Information */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">{t('patientInformation')}</h3>
              <p><strong>{t('name')}:</strong> {patientName}</p>
              <p><strong>{t('patientId')}:</strong> {patientId}</p>
              
              {/* Chief Complaint Input */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">{t('chiefComplaint')}</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder={t('enterChiefComplaint')}
                  disabled={!canPerformTriage}
                  rows={2}
                />
              </div>
            </div>
            
            {/* Vital Signs */}
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{t('vitalSigns')}</h3>
                {canPerformTriage && (
                  <Button size="sm" variant="outline" onClick={handleVitalSignsUpdate}>
                    <Activity className="h-4 w-4 mr-1" />
                    {t('updateVitals')}
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('heartRate')}</p>
                  <p className="text-lg font-medium">{vitals.heartRate} bpm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('bloodPressure')}</p>
                  <p className="text-lg font-medium">{vitals.bloodPressure} mmHg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('respiratoryRate')}</p>
                  <p className="text-lg font-medium">{vitals.respiratoryRate} bpm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('temperature')}</p>
                  <p className="text-lg font-medium">{vitals.temperature}°C</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('oxygenSaturation')}</p>
                  <p className="text-lg font-medium">{vitals.oxygenSaturation}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('painLevel')}</p>
                  <p className="text-lg font-medium">{vitals.painLevel}/10</p>
                </div>
              </div>
            </div>
            
            {/* Triage Levels */}
            {canPerformTriage && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">{t('assignTriageLevel')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                  <Button 
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => handleTriageSubmit('immediate')}
                  >
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    {t('immediate')}
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleTriageSubmit('emergent')}
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    {t('emergent')}
                  </Button>
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => handleTriageSubmit('urgent')}
                  >
                    {t('urgent')}
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleTriageSubmit('semi-urgent')}
                  >
                    {t('semiUrgent')}
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => handleTriageSubmit('non-urgent')}
                  >
                    {t('nonUrgent')}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Current Triage Level */}
            {triageLevel && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t('currentTriageLevel')}</h3>
                <div className={`px-4 py-2 rounded-md inline-block ${getTriageLevelColor(triageLevel)}`}>
                  {triageLevel === 'immediate' && t('immediate')}
                  {triageLevel === 'emergent' && t('emergent')}
                  {triageLevel === 'urgent' && t('urgent')}
                  {triageLevel === 'semi-urgent' && t('semiUrgent')}
                  {triageLevel === 'non-urgent' && t('nonUrgent')}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('triageTimestamp')}: {new Date().toLocaleTimeString()}
                </p>
              </div>
            )}
            
            {/* Emergency Treatment Actions */}
            {canTreatEmergency && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">{t('emergencyTreatment')}</h3>
                <div className="space-y-2">
                  <Button
                    className="w-full justify-start"
                    onClick={handleInitiateTreatment}
                  >
                    <Stethoscope className="mr-2 h-4 w-4" />
                    {t('initiateTreatment')}
                  </Button>
                  {isPhysician && (
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      {t('orderEmergencyDiagnostics')}
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Permission Messages */}
            {!canPerformTriage && !canTreatEmergency && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  {t('noEmergencyCarePermissions')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyTriageWorkflow;
