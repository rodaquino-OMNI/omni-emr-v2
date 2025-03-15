
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Check, X, Scan, QrCode, User, Pill, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface PatientData {
  id: string;
  name: string;
  allergies: string[];
  roomNumber: string;
  mrn: string;
}

interface MedicationData {
  id: string;
  medicationName: string;
  dosage: string;
  route: string;
  medicationType?: string;
}

interface MedicationScannerProps {
  open: boolean;
  onClose: () => void;
  patient: PatientData | null;
  medication: MedicationData | null;
  onPatientScan: (id: string) => void;
  onMedicationScan: (code: string) => void;
  onVerify: () => void;
  patientScanned: boolean;
  medicationScanned: boolean;
}

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
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [manualPatientId, setManualPatientId] = useState('');
  const [manualMedicationCode, setManualMedicationCode] = useState('');
  
  const handleManualSubmit = () => {
    if (manualPatientId) {
      onPatientScan(manualPatientId);
    }
    if (manualMedicationCode) {
      onMedicationScan(manualMedicationCode);
    }
  };
  
  // In a real app, this would use the device camera
  // For this demo, we'll simulate scanning after a delay
  const simulateScan = (type: 'patient' | 'medication') => {
    const simulateButton = document.getElementById(`simulate-${type}-scan`);
    if (simulateButton) {
      simulateButton.textContent = t('scanning');
      simulateButton.setAttribute('disabled', 'true');
      
      setTimeout(() => {
        if (type === 'patient' && patient) {
          onPatientScan(patient.id);
        } else if (type === 'medication' && medication) {
          onMedicationScan(medication.id);
        }
        
        simulateButton.textContent = t('scanComplete');
      }, 1500);
    }
  };
  
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
          <div className="mb-4 text-center">
            <h3 className="font-medium">{medication?.medicationName} {medication?.dosage}</h3>
            <p className="text-sm text-muted-foreground">{medication?.route}</p>
            
            {/* Allergy warning if present */}
            {patient && medication && patient.allergies.some(allergy => 
              medication.medicationName.toLowerCase().includes(allergy.toLowerCase())
            ) && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-md p-2 text-left">
                <div className="flex items-center font-medium text-red-800 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
                  {t('allergyWarning')}
                </div>
                <p className="text-xs text-red-700 mt-1">
                  {t('patientHasAllergy', { medication: medication.medicationName })}
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card className={`p-3 ${patientScanned ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex items-center text-sm font-medium mb-2">
                <User className="h-4 w-4 mr-1" />
                {t('patient')}
                {patientScanned && <Check className="h-4 w-4 ml-auto text-green-600" />}
              </div>
              {patient && (
                <div className="text-xs">{patient.name} • {patient.mrn}</div>
              )}
            </Card>
            
            <Card className={`p-3 ${medicationScanned ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex items-center text-sm font-medium mb-2">
                <Pill className="h-4 w-4 mr-1" />
                {t('medication')}
                {medicationScanned && <Check className="h-4 w-4 ml-auto text-green-600" />}
              </div>
              {medication && (
                <div className="text-xs">{medication.medicationName}</div>
              )}
            </Card>
          </div>
          
          <Tabs defaultValue="camera" value={activeTab} onValueChange={(value) => setActiveTab(value as 'camera' | 'manual')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="camera">
                <QrCode className="h-4 w-4 mr-1" />
                {t('scanBarcode')}
              </TabsTrigger>
              <TabsTrigger value="manual">
                {t('manualEntry')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="camera" className="space-y-4">
              <div className="text-center py-6 border-2 border-dashed rounded-md bg-muted">
                <QrCode className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">{t('cameraScanPlaceholder')}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  id="simulate-patient-scan"
                  onClick={() => simulateScan('patient')}
                  disabled={patientScanned}
                >
                  {patientScanned ? t('patientScanned') : t('scanPatient')}
                </Button>
                <Button 
                  variant="outline" 
                  id="simulate-medication-scan"
                  onClick={() => simulateScan('medication')}
                  disabled={medicationScanned}
                >
                  {medicationScanned ? t('medicationScanned') : t('scanMedication')}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('patientId')}</label>
                  <Input 
                    placeholder={t('enterPatientId')}
                    value={manualPatientId} 
                    onChange={(e) => setManualPatientId(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('medicationCode')}</label>
                  <Input 
                    placeholder={t('enterMedicationCode')}
                    value={manualMedicationCode} 
                    onChange={(e) => setManualMedicationCode(e.target.value)} 
                  />
                </div>
                <Button className="w-full" onClick={handleManualSubmit}>
                  {t('submitCodes')}
                </Button>
              </div>
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
