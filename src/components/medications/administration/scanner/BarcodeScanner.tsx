
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { QrCode, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
              <div className="w-3/4 h-1/3 border-2 border-primary rounded-lg"></div>
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
          variant="outline" 
          onClick={() => onCapture('patient')}
          disabled={patientScanned}
        >
          {patientScanned ? t('patientScanned') : t('scanPatient')}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onCapture('medication')}
          disabled={medicationScanned}
        >
          {medicationScanned ? t('medicationScanned') : t('scanMedication')}
        </Button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
