
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
import { Check, X, Scan, User, Pill, Camera, Shield, AlertTriangle } from 'lucide-react';
import ScanItem from './scanner/ScanItem';
import BarcodeScanner from './scanner/BarcodeScanner';
import ManualEntryForm from './scanner/ManualEntryForm';
import MedicationHeader from './scanner/MedicationHeader';
import { useMedicationScanner } from './scanner/useMedicationScanner';
import { MedicationScannerProps } from './scanner/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

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
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-600" />
              {t('medicationVerification')}
            </DialogTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800/30">
              EHR-Verified
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t('scannerSafetyDescription') || 'Enhanced safety verification with barcode scanning and EHR integration'}
          </p>
        </DialogHeader>
        
        <Alert variant="info" className="my-2">
          <Shield className="h-4 w-4" />
          <AlertTitle>{t('safetyFeatureActive') || 'Safety Feature Active'}</AlertTitle>
          <AlertDescription>
            {t('doubleVerificationActive') || 'Double verification with EHR system is enabled for additional patient safety'}
          </AlertDescription>
        </Alert>
        
        <div className="py-2">
          <MedicationHeader medication={medication} patient={patient} />
          
          <div className="grid grid-cols-2 gap-4 mt-4 mb-5">
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
              <TabsTrigger value="camera" className="flex items-center">
                <Camera className="h-4 w-4 mr-1" />
                {t('scanBarcode')}
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
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
        
        {!patientScanned || !medicationScanned ? (
          <Alert variant="warning" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('pleaseCompleteScan') || 'Please complete scanning both the patient and medication for verification'}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success" className="mt-2">
            <Check className="h-4 w-4" />
            <AlertDescription>
              {t('readyForVerification') || 'Ready for final verification and administration'}
            </AlertDescription>
          </Alert>
        )}
        
        <DialogFooter className="sm:justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            {t('cancel')}
          </Button>
          <Button 
            variant="default" 
            onClick={onVerify} 
            disabled={!patientScanned || !medicationScanned}
            className={patientScanned && medicationScanned ? "bg-green-600 hover:bg-green-700" : ""}
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
