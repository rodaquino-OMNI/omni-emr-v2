
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Shield, Search, Database } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ManualEntryFormProps {
  manualPatientId: string;
  setManualPatientId: (id: string) => void;
  manualMedicationCode: string;
  setManualMedicationCode: (code: string) => void;
  onSubmit: () => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  manualPatientId,
  setManualPatientId,
  manualMedicationCode,
  setManualMedicationCode,
  onSubmit
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <Alert variant="info" className="bg-blue-50 border-blue-200 text-blue-800">
        <Database className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          {t('manualEntryVerification') || 'Manual entries are cross-checked with EHR data for verification'}
        </AlertDescription>
      </Alert>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="patientId" className="flex items-center">
            {t('patientId')}
            <Shield className="h-3.5 w-3.5 ml-1 text-green-600" />
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="patientId"
              value={manualPatientId}
              onChange={(e) => setManualPatientId(e.target.value)}
              placeholder={t('enterPatientId') || "Enter patient ID"}
              className="pl-10"
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t('patientIdDescription') || "Enter the patient's unique identifier"}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="medicationCode" className="flex items-center">
            {t('medicationCode')}
            <Shield className="h-3.5 w-3.5 ml-1 text-green-600" />
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="medicationCode"
              value={manualMedicationCode}
              onChange={(e) => setManualMedicationCode(e.target.value)}
              placeholder={t('enterMedicationCode') || "Enter medication code"}
              className="pl-10"
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t('medicationCodeDescription') || "Enter the medication barcode or NDC number"}</p>
        </div>
      </div>
      
      <Button 
        className="w-full"
        onClick={onSubmit}
        disabled={!manualPatientId || !manualMedicationCode}
      >
        <Search className="h-4 w-4 mr-1" />
        {t('verifyIdentifiers')}
      </Button>
    </div>
  );
};

export default ManualEntryForm;
