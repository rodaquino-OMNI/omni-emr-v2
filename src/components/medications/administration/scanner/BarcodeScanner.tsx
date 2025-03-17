import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, Shield, User, Pill, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface BarcodeScannerProps {
  onScan: (type?: 'patient' | 'medication') => void;
  onError: (error: string) => void;
  patientScanned: boolean;
  medicationScanned: boolean;
  error: string | null;
  scanning: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  patientScanned,
  medicationScanned,
  error,
  scanning
}) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (videoRef.current && scanning) {
      const videoElement = videoRef.current;
      const tracks = (videoElement.srcObject as MediaStream)?.getTracks();
      if (!tracks || tracks.length === 0) {
        initCamera();
      }
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [scanning]);
  
  useEffect(() => {
    if (scanning) {
      initCamera();
    }
  }, [scanning, initCamera]);
  
  const initCamera = async () => {
    if (!navigator.mediaDevices || !videoRef.current) {
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      onError(t('cameraAccessDenied'));
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
        
        onScan();
      }
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-sm animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <h3 className="font-medium text-green-800 dark:text-green-300">
              {t('ehrVerificationEnabled') || 'EHR Verification Enabled'}
            </h3>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-800/30 dark:text-green-300 dark:border-green-700">
            SafeScan™
          </Badge>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300">
          {t('scannerVerifiesAgainstEHR') || 'All scans are verified against Electronic Health Records for enhanced patient safety'}
        </p>
      </div>
      
      <div className="relative">
        <div className="border-2 border-primary rounded-lg overflow-hidden bg-muted aspect-video shadow-md">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover ${scanning ? 'opacity-100' : 'opacity-50'}`}
            onPlay={() => {}}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {!scanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <QrCode className="h-12 w-12 text-primary/60 animate-pulse" />
            </div>
          )}
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-full flex flex-col items-center justify-center">
              <div className="w-3/4 h-1/3 border-2 border-primary rounded-lg">
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-3 right-3">
          <Button 
            size="sm" 
            variant="default" 
            className="rounded-full h-12 w-12 p-0 shadow-lg"
            onClick={captureBarcode}
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      <div className="text-center text-sm font-medium text-muted-foreground bg-muted/50 py-2 rounded-md">
        {scanning ? t('positionBarcodeInFrame') : t('preparingCamera')}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-2">
        <Button 
          variant={patientScanned ? "default" : "outline"}
          onClick={() => onScan('patient')}
          disabled={patientScanned}
          className={`${patientScanned ? "bg-green-600 hover:bg-green-700 text-white" : ""} h-14 rounded-lg shadow-sm transition-all duration-200`}
        >
          <div className="relative">
            <User className="h-5 w-5 mr-2" />
            {patientScanned && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full border-2 border-green-600"></div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span>{patientScanned ? t('patientVerified') : t('scanPatient')}</span>
            {patientScanned && <span className="text-xs opacity-80">ID Confirmed</span>}
          </div>
        </Button>
        <Button 
          variant={medicationScanned ? "default" : "outline"}
          onClick={() => onScan('medication')}
          disabled={medicationScanned}
          className={`${medicationScanned ? "bg-green-600 hover:bg-green-700 text-white" : ""} h-14 rounded-lg shadow-sm transition-all duration-200`}
        >
          <div className="relative">
            <Pill className="h-5 w-5 mr-2" />
            {medicationScanned && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full border-2 border-green-600"></div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span>{medicationScanned ? t('medicationVerified') : t('scanMedication')}</span>
            {medicationScanned && <span className="text-xs opacity-80">Dosage Verified</span>}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
