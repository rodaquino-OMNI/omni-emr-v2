
import React from 'react';
import { HardDrive, Lock, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface DatabaseActivityIndicatorProps {
  lastUpdated?: string;
}

const DatabaseActivityIndicator = ({ lastUpdated }: DatabaseActivityIndicatorProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="mt-6 bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-950/20 dark:to-purple-950/20 rounded-md p-4 border border-cyan-200 dark:border-cyan-800/30">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
          <HardDrive className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h3 className="font-medium text-sm text-cyan-800 dark:text-cyan-300">
            {language === 'pt' ? 'Armazenamento Seguro de Dados' : 'Secure Data Storage'}
          </h3>
          <p className="text-xs text-cyan-700/70 dark:text-cyan-400/70 mt-0.5">
            {language === 'pt' 
              ? 'Seus dados estão armazenados com criptografia de ponta a ponta' 
              : 'Your data is stored with end-to-end encryption'}
          </p>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/50 p-2 rounded-md">
          <Lock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs text-cyan-800 dark:text-cyan-300">
            {language === 'pt' ? 'Acesso Restrito' : 'Restricted Access'}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/50 p-2 rounded-md">
          <Shield className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs text-cyan-800 dark:text-cyan-300">
            {language === 'pt' ? 'Proteção HIPAA' : 'HIPAA Protection'}
          </span>
        </div>
      </div>
      
      {lastUpdated && (
        <div className="mt-3 text-xs text-center text-cyan-700/70 dark:text-cyan-400/70">
          {language === 'pt' ? `Última atualização: ${lastUpdated}` : `Last updated: ${lastUpdated}`}
        </div>
      )}
    </div>
  );
};

export default DatabaseActivityIndicator;
