
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
import { Check, X, Scan, User, Pill, Camera, Shield, AlertTriangle, Lock } from 'lucide-react';
import ScanItem from './scanner/ScanItem';
import BarcodeScanner from './scanner/BarcodeScanner';
import ManualEntryForm from './scanner/ManualEntryForm';
import MedicationHeader from './scanner/MedicationHeader';
import { useMedicationScanner } from './scanner/useMedicationScanner';
import { MedicationScannerProps } from './scanner/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-lg">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-2 shadow-sm">
                <Shield className="h-4 w-4 text-white" />
              </div>
              {t('medicationVerification')}
            </DialogTitle>
            <Badge 
              variant="outline" 
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800/30 px-2 py-1 rounded-full"
            >
              <Lock className="h-3 w-3 mr-1" />
              EHR-Protected
            </Badge>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-2 rounded-md mt-3 shadow-sm border border-green-100 dark:border-green-900/30 animate-fade-in">
            <p className="text-sm text-green-800 dark:text-green-300 flex items-center">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400 mr-1 flex-shrink-0" />
              <span>{t('scannerSafetyDescription') || 'Enhanced safety verification with barcode scanning and real-time EHR integration'}</span>
            </p>
          </div>
        </DialogHeader>
        
        <Alert variant="info" className="my-3 border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800/30 shadow-sm">
          <div className="flex">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="ml-2">
              <AlertTitle className="mb-1">{t('safetyFeatureActive') || 'Advanced Safety System Active'}</AlertTitle>
              <AlertDescription className="text-xs text-blue-700 dark:text-blue-300">
                {t('doubleVerificationActive') || 'Three-way verification: Barcode scan + EHR database + AI safety analysis'}
              </AlertDescription>
            </div>
          </div>
        </Alert>
        
        <div className="py-2">
          <MedicationHeader medication={medication} patient={patient} />
          
          <div className="grid grid-cols-2 gap-4 my-4">
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
          
          <Separator className="my-4" />
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as 'camera' | 'manual')} className="mt-2">
            <TabsList className="grid w-full grid-cols-2 mb-4 rounded-lg p-1 bg-muted/70 border border-muted-foreground/10">
              <TabsTrigger value="camera" className="flex items-center rounded-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white py-2">
                <Camera className="h-4 w-4 mr-1.5" />
                {t('scanBarcode')}
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center rounded-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white py-2">
                <Shield className="h-4 w-4 mr-1.5" />
                {t('manualEntry')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="camera" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              <BarcodeScanner
                onCapture={simulateScan}
                patientScanned={patientScanned}
                medicationScanned={medicationScanned}
                error={error}
                scanning={scanning}
              />
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
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
          <Alert variant="warning" className="mt-2 border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-800/30 shadow-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="font-medium">
              {t('pleaseCompleteScan') || 'Please complete scanning both the patient and medication for safety verification'}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success" className="mt-2 border-green-200 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800/30 shadow-sm">
            <div className="flex items-start">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="ml-2">
                <AlertTitle className="mb-0.5 text-green-800 dark:text-green-300">{t('verificationComplete') || 'Verification Complete'}</AlertTitle>
                <AlertDescription className="text-xs text-green-700 dark:text-green-400">
                  {t('readyForVerification') || 'All safety checks passed. Ready for final verification and administration'}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
        
        <DialogFooter className="sm:justify-between mt-4 pt-2 border-t border-muted">
          <Button variant="outline" onClick={onClose} className="gap-1">
            <X className="h-4 w-4" />
            {t('cancel')}
          </Button>
          <Button 
            variant="default" 
            onClick={onVerify} 
            disabled={!patientScanned || !medicationScanned}
            className={`${patientScanned && medicationScanned ? "bg-green-600 hover:bg-green-700 shadow-md" : ""} gap-1.5 px-4`}
          >
            <Check className="h-4 w-4" />
            {t('confirmAdministration')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationScanner;
