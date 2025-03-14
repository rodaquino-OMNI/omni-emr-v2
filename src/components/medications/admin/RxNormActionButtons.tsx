
import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, Trash2, FileSpreadsheet } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface RxNormActionButtonsProps {
  isSyncing: boolean;
  isClearing: boolean;
  totalCacheEntries: number;
  onSync: () => Promise<void>;
  onClearCache: () => Promise<void>;
}

const RxNormActionButtons: React.FC<RxNormActionButtonsProps> = ({
  isSyncing,
  isClearing,
  totalCacheEntries,
  onSync,
  onClearCache
}) => {
  const { t, language } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onSync} disabled={isSyncing}>
        {isSyncing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            {language === 'pt' ? 'Sincronizando...' : 'Syncing...'}
          </>
        ) : (
          <>
            <Database className="h-4 w-4 mr-2" />
            {t('syncRxNormData')}
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={onClearCache}
        disabled={isClearing || totalCacheEntries === 0}
      >
        {isClearing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            {language === 'pt' ? 'Limpando...' : 'Clearing...'}
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Limpar Cache Expirado' : 'Clear Expired Cache'}
          </>
        )}
      </Button>
      
      <Button variant="outline">
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        {language === 'pt' ? 'Exportar Mapeamentos' : 'Export Mappings'}
      </Button>
    </div>
  );
};

export default RxNormActionButtons;
