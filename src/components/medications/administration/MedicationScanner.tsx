import React, { useState, useRef, useEffect } from 'react';
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
import { Check, X, Scan, QrCode, User, Pill, AlertTriangle, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleManualSubmit = () => {
    // For manual entry, we'll verify against the EHR system
    if (manualPatientId) {
      verifyPatientWithEHR(manualPatientId)
        .then(verified => {
          if (verified) {
            onPatientScan(manualPatientId);
            toast.success(t('patientVerified'));
          } else {
            toast.error(t('patientVerificationFailed'));
          }
        })
        .catch(() => toast.error(t('ehrConnectionError')));
    }
    
    if (manualMedicationCode) {
      verifyMedicationWithEHR(manualMedicationCode)
        .then(verified => {
          if (verified) {
            onMedicationScan(manualMedicationCode);
            toast.success(t('medicationVerified'));
          } else {
            toast.error(t('medicationVerificationFailed'));
          }
        })
        .catch(() => toast.error(t('ehrConnectionError')));
    }
  };
  
  // Mock EHR verification functions - in a real app these would connect to the EHR API
  const verifyPatientWithEHR = async (patientId: string): Promise<boolean> => {
    // Simulate API call to EHR system
    return new Promise(resolve => {
      setTimeout(() => {
        // In real implementation, this would check against the hospital EHR system
        resolve(patient?.id === patientId || patient?.mrn === patientId);
      }, 800);
    });
  };
  
  const verifyMedicationWithEHR = async (medicationCode: string): Promise<boolean> => {
    // Simulate API call to EHR system
    return new Promise(resolve => {
      setTimeout(() => {
        // In real implementation, this would check against the hospital pharmacy system
        resolve(medication?.id === medicationCode);
      }, 800);
    });
  };
  
  // In a real app, this would use a barcode scanning library like zxing or quagga
  useEffect(() => {
    if (activeTab === 'camera' && open && !scanning) {
      initCamera();
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [activeTab, open, scanning]);
  
  const initCamera = async () => {
    if (!navigator.mediaDevices || !videoRef.current) {
      setError(t('cameraNotSupported'));
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(t('cameraAccessDenied'));
    }
  };
  
  const captureBarcode = () => {
    if (videoRef.current && canvasRef.current && scanning) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // In a real app, you would process the image to detect barcodes
        // For this demo, we'll simulate successful scanning
        simulateScan();
      }
    }
  };
  
  // Simulate barcode scanning for demo purposes
  const simulateScan = (type?: 'patient' | 'medication') => {
    setScanning(false);
    
    // If a specific type was requested, scan that; otherwise alternate
    const scanType = type || (!patientScanned ? 'patient' : !medicationScanned ? 'medication' : 'patient');
    
    toast.success(t('scanning'));
    
    setTimeout(() => {
      if (scanType === 'patient' && patient) {
        onPatientScan(patient.id);
        toast.success(t('patientScanned'));
      } else if (scanType === 'medication' && medication) {
        onMedicationScan(medication.id);
        toast.success(t('medicationScanned'));
      }
      
      setScanning(true);
    }, 1500);
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
                <Camera className="h-4 w-4 mr-1" />
                {t('scanBarcode')}
              </TabsTrigger>
              <TabsTrigger value="manual">
                {t('manualEntry')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="camera" className="space-y-4">
              {error && (
                <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                  {error}
                </div>
              )}
              
              <div className="relative">
                <div className="border-2 border-dashed rounded-md overflow-hidden bg-muted aspect-video">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover ${scanning ? 'opacity-100' : 'opacity-50'}`}
                    onPlay={() => setScanning(true)}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!scanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                      <QrCode className="h-10 w-10 text-muted-foreground animate-pulse" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="h-full w-full flex flex-col items-center justify-center">
                      <div className="w-3/4 h-1/3 border-2 border-primary rounded-lg"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-3 right-3">
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="rounded-full h-10 w-10 p-0"
                    onClick={() => captureBarcode()}
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                {scanning ? t('positionBarcodeInFrame') : t('preparingCamera')}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => simulateScan('patient')}
                  disabled={patientScanned}
                >
                  {patientScanned ? t('patientScanned') : t('scanPatient')}
                </Button>
                <Button 
                  variant="outline" 
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
                <Button className="w-full" onClick={handleManualSubmit}>
                  {t('verifyIDs')}
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
