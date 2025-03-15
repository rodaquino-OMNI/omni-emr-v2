
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Scan, User, Pill, Camera } from 'lucide-react';
import ScanItem from './scanner/ScanItem';
import BarcodeScanner from './scanner/BarcodeScanner';
import ManualEntryForm from './scanner/ManualEntryForm';
import MedicationHeader from './scanner/MedicationHeader';
import { useMedicationScanner } from './scanner/useMedicationScanner';
import { MedicationScannerProps } from './scanner/types';

const MedicationScanner = ({
  open,
  onClose,
  patient,
  medication,
  onPatientScan,
  onMedicationScan,
  onVerify,
  patientScanned,
  medicationScanned
}: MedicationScannerProps) => {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    manualPatientId,
    setManualPatientId,
    manualMedicationCode,
    setManualMedicationCode,
    scanning,
    error,
    handleManualSubmit,
    simulateScan
  } = useMedicationScanner(patient, medication, onPatientScan, onMedicationScan);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Scan className="mr-2 h-5 w-5" />
            {t('medicationVerification')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <MedicationHeader medication={medication} patient={patient} />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <ScanItem
              title={t('patient')}
              entity={patient}
              entityType="patient"
              isScanned={patientScanned}
              icon={<User className="h-4 w-4 mr-1" />}
            />
            
            <ScanItem
              title={t('medication')}
              entity={medication}
              entityType="medication"
              isScanned={medicationScanned}
              icon={<Pill className="h-4 w-4 mr-1" />}
            />
          </div>
          
          <Tabs defaultValue="camera" value={activeTab} onValueChange={(value) => setActiveTab(value as 'camera' | 'manual')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="camera">
                <Camera className="h-4 w-4 mr-1" />
                {t('scanBarcode')}
              </TabsTrigger>
              <TabsTrigger value="manual">
                {t('manualEntry')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="camera" className="space-y-4">
              <BarcodeScanner
                onCapture={simulateScan}
                patientScanned={patientScanned}
                medicationScanned={medicationScanned}
                error={error}
                scanning={scanning}
              />
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <ManualEntryForm
                manualPatientId={manualPatientId}
                setManualPatientId={setManualPatientId}
                manualMedicationCode={manualMedicationCode}
                setManualMedicationCode={setManualMedicationCode}
                onSubmit={handleManualSubmit}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            {t('cancel')}
          </Button>
          <Button 
            variant="default" 
            onClick={onVerify} 
            disabled={!patientScanned || !medicationScanned}
          >
            <Check className="h-4 w-4 mr-1" />
            {t('confirmAdministration')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationScanner;
