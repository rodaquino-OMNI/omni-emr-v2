
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Shield, FileBarChart, QrCode } from 'lucide-react';

interface PageHeaderProps {
  scanMode: boolean;
  setScanMode: (mode: boolean) => void;
  language: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ scanMode, setScanMode, language }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
          <Shield className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">
            {t('medicationAdministration')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === 'pt' 
              ? 'Segurança aprimorada com scanner e verificação' 
              : 'Enhanced safety with scanning and verification'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          className="gap-2"
          onClick={() => setScanMode(!scanMode)}
        >
          <QrCode className="h-4 w-4" />
          {scanMode ? t('exitScanMode') || 'Exit Scan Mode' : t('scanMode') || 'Scan Mode'}
        </Button>
        
        <Button className="gap-2">
          <FileBarChart className="h-4 w-4" />
          {t('reports') || 'Reports'}
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
