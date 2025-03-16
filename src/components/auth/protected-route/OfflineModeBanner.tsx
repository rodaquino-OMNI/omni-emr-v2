
import React from 'react';
import { WifiOff } from 'lucide-react';
import { Languages } from '@/types/auth';

interface OfflineModeBannerProps {
  language: Languages;
}

export const OfflineModeBanner: React.FC<OfflineModeBannerProps> = ({ language }) => {
  return (
    <div className="bg-yellow-50 text-yellow-800 px-4 py-2 flex items-center gap-2 text-sm border-b border-yellow-100">
      <WifiOff className="h-4 w-4" />
      <span>
        {language === 'pt'
          ? 'Modo offline: Funcionalidade limitada disponível. Alguns recursos podem não funcionar corretamente.'
          : 'Offline mode: Limited functionality available. Some features may not work correctly.'}
      </span>
    </div>
  );
};
