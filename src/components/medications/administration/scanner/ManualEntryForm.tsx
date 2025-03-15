
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Shield, Search, Database, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-5">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 shadow-sm animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="font-medium text-blue-800 dark:text-blue-300">
              {t('manualEntryVerification') || 'Manual Entry with EHR Verification'}
            </h3>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-800/30 dark:text-blue-300 dark:border-blue-700">
            EHR-Secure
          </Badge>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t('manualEntryVerificationDescription') || 'Manual entries undergo the same rigorous safety checks as scanned barcodes, verifying against Electronic Health Records'}
        </p>
      </div>
      
      <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800 shadow-sm">
        <AlertTriangle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
        <AlertTitle>
          {t('importantSafetyReminder') || 'Important Safety Reminder'}
        </AlertTitle>
        <AlertDescription className="mt-1">
          {t('doubleCheckIdentifiers') || 'Double-check all identifiers before submission to ensure patient safety'}
        </AlertDescription>
      </Alert>
      
      <div className="space-y-5 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="space-y-2.5">
          <Label htmlFor="patientId" className="flex items-center text-sm font-medium">
            {t('patientId')}
            <Shield className="h-3.5 w-3.5 ml-1 text-green-600 dark:text-green-400" />
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <Input
              id="patientId"
              value={manualPatientId}
              onChange={(e) => setManualPatientId(e.target.value)}
              placeholder={t('enterPatientId') || "Enter patient ID"}
              className="pl-10 border-blue-200 dark:border-blue-800 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t('patientIdDescription') || "Enter the patient's unique identifier to verify against EHR"}</p>
        </div>
        
        <div className="space-y-2.5">
          <Label htmlFor="medicationCode" className="flex items-center text-sm font-medium">
            {t('medicationCode')}
            <Shield className="h-3.5 w-3.5 ml-1 text-green-600 dark:text-green-400" />
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <Input
              id="medicationCode"
              value={manualMedicationCode}
              onChange={(e) => setManualMedicationCode(e.target.value)}
              placeholder={t('enterMedicationCode') || "Enter medication code"}
              className="pl-10 border-blue-200 dark:border-blue-800 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t('medicationCodeDescription') || "Enter the medication barcode or NDC number for verification"}</p>
        </div>
      </div>
      
      <Button 
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-lg transition-all duration-200"
        onClick={onSubmit}
        disabled={!manualPatientId || !manualMedicationCode}
      >
        <Search className="h-5 w-5 mr-2" />
        <span className="font-medium">{t('verifyIdentifiers') || 'Verify & Validate'}</span>
      </Button>
      
      <div className="flex items-center justify-center text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 mr-1 text-green-600 dark:text-green-400" />
        <span>{t('ehrVerificationNotice') || 'All entries are encrypted and verified against EHR for patient safety'}</span>
      </div>
    </div>
  );
};

export default ManualEntryForm;
