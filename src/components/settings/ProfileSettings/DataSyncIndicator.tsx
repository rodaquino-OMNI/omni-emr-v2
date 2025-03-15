
import React from 'react';
import { Database, Shield, CheckCircle2, XCircle, RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';

interface DataSyncIndicatorProps {
  loading: boolean;
  lastSynced?: string;
  hasError?: boolean;
  errorMessage?: string;
}

const DataSyncIndicator = ({ 
  loading, 
  lastSynced, 
  hasError, 
  errorMessage 
}: DataSyncIndicatorProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="rounded-md border border-border bg-background/50 backdrop-blur-sm p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-full ${hasError ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'}`}>
          {hasError ? (
            <XCircle className="h-5 w-5" />
          ) : loading ? (
            <RotateCw className="h-5 w-5 animate-spin" />
          ) : (
            <Database className="h-5 w-5" />
          )}
        </div>
        <div>
          <div className="font-medium text-sm flex items-center">
            {language === 'pt' ? 'Status de Sincronização' : 'Sync Status'}
            {!loading && !hasError && (
              <Badge variant="data" className="ml-2">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {language === 'pt' ? 'Sincronizado' : 'Synced'}
              </Badge>
            )}
            {loading && (
              <Badge variant="info" className="ml-2">
                <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                {language === 'pt' ? 'Sincronizando' : 'Syncing'}
              </Badge>
            )}
            {hasError && (
              <Badge variant="destructive" className="ml-2">
                <XCircle className="h-3 w-3 mr-1" />
                {language === 'pt' ? 'Erro' : 'Error'}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {hasError 
              ? errorMessage || (language === 'pt' ? 'Erro ao sincronizar dados' : 'Error syncing data')
              : loading 
                ? (language === 'pt' ? 'Sincronizando seus dados com o servidor...' : 'Syncing your data with the server...')
                : lastSynced 
                  ? (language === 'pt' ? `Última sincronização: ${lastSynced}` : `Last synced: ${lastSynced}`)
                  : (language === 'pt' ? 'Dados atualizados' : 'Data up to date')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
        <span className="text-xs text-cyan-700 dark:text-cyan-300">
          {language === 'pt' ? 'Dados Criptografados' : 'Encrypted Data'}
        </span>
      </div>
    </div>
  );
};

export default DataSyncIndicator;
