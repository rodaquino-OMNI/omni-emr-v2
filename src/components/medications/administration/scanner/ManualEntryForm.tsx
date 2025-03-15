
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      <div>
        <label className="text-sm font-medium mb-1 block">{t('patientId')}</label>
        <Input 
          placeholder={t('enterPatientIdOrMRN')}
          value={manualPatientId} 
          onChange={(e) => setManualPatientId(e.target.value)} 
        />
        <p className="text-xs text-muted-foreground mt-1">{t('enterPatientIdOrMRNHint')}</p>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">{t('medicationCode')}</label>
        <Input 
          placeholder={t('enterMedicationBarcode')}
          value={manualMedicationCode} 
          onChange={(e) => setManualMedicationCode(e.target.value)} 
        />
        <p className="text-xs text-muted-foreground mt-1">{t('enterMedicationBarcodeHint')}</p>
      </div>
      <Button className="w-full" onClick={onSubmit}>
        {t('verifyIDs')}
      </Button>
    </div>
  );
};

export default ManualEntryForm;
