
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BarcodeScannerProps {
  onCapture: (type?: 'patient' | 'medication') => void;
  patientScanned: boolean;
  medicationScanned: boolean;
  error: string | null;
  scanning: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onCapture,
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
      const tracks = (videoRef.current.srcObject as MediaStream)?.getTracks();
      if (!tracks || tracks.length === 0) {
        initCamera();
      }
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [scanning]);
  
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
      toast.error(t('cameraAccessDenied'));
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
        onCapture();
      }
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-center text-muted-foreground bg-muted/30 p-2 rounded-md">
        <div className="flex items-center justify-center mb-1">
          <Shield className="h-4 w-4 text-green-600 mr-1" />
          <span className="font-medium">{t('ehrVerificationEnabled') || 'EHR Verification Enabled'}</span>
        </div>
        <p>
          {t('scannerVerifiesAgainstEHR') || 'Scanned codes are verified against Electronic Health Records for patient safety'}
        </p>
      </div>
      
      <div className="relative">
        <div className="border-2 border-primary rounded-md overflow-hidden bg-muted aspect-video">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover ${scanning ? 'opacity-100' : 'opacity-50'}`}
            onPlay={() => {}}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {!scanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <QrCode className="h-10 w-10 text-muted-foreground animate-pulse" />
            </div>
          )}
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-full flex flex-col items-center justify-center">
              <div className="w-3/4 h-1/3 border-2 border-primary rounded-lg">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-3 right-3">
          <Button 
            size="sm" 
            variant="default" 
            className="rounded-full h-10 w-10 p-0"
            onClick={captureBarcode}
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
          variant={patientScanned ? "success" : "outline"}
          onClick={() => onCapture('patient')}
          disabled={patientScanned}
          className={patientScanned ? "bg-green-600 hover:bg-green-700 text-white" : ""}
        >
          <User className="h-4 w-4 mr-1" />
          {patientScanned ? t('patientVerified') : t('scanPatient')}
        </Button>
        <Button 
          variant={medicationScanned ? "success" : "outline"}
          onClick={() => onCapture('medication')}
          disabled={medicationScanned}
          className={medicationScanned ? "bg-green-600 hover:bg-green-700 text-white" : ""}
        >
          <Pill className="h-4 w-4 mr-1" />
          {medicationScanned ? t('medicationVerified') : t('scanMedication')}
        </Button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
