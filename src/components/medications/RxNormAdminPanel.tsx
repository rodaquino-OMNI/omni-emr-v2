import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Database, RefreshCw, Trash2, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { clearExpiredCache, syncFrequentlyUsedMedications } from '@/services/rxnorm';

interface DatabaseStats {
  totalMedications: number;
  totalMappings: number;
  totalCacheEntries: number;
  lastSyncDate: Date | null;
}

const RxNormAdminPanel: React.FC = () => {
  const { t, language } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    totalMedications: 0,
    totalMappings: 0,
    totalCacheEntries: 0,
    lastSyncDate: null
  });

  const fetchStats = async () => {
    try {
      const medCountQuery = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rxnorm_items?select=count`,
        {
          method: 'HEAD',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'count=exact'
          }
        }
      );
      const medCount = parseInt(medCountQuery.headers.get('content-range')?.split('/')[1] || '0');
      
      const mappingCountQuery = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rxnorm_anvisa_mappings?select=count`,
        {
          method: 'HEAD',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'count=exact'
          }
        }
      );
      const mappingCount = parseInt(mappingCountQuery.headers.get('content-range')?.split('/')[1] || '0');
      
      const cacheCountQuery = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rxnorm_search_cache?select=count`,
        {
          method: 'HEAD',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'count=exact'
          }
        }
      );
      const cacheCount = parseInt(cacheCountQuery.headers.get('content-range')?.split('/')[1] || '0');
      
      const syncLogResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rxnorm_sync_log?select=sync_date&order=sync_date.desc&limit=1`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const syncLogData = await syncLogResponse.json();
      const lastSyncDate = syncLogData.length > 0 ? new Date(syncLogData[0].sync_date) : null;
      
      setDbStats({
        totalMedications: medCount || 0,
        totalMappings: mappingCount || 0,
        totalCacheEntries: cacheCount || 0,
        lastSyncDate
      });
    } catch (error) {
      console.error('Error fetching RxNorm database stats:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro ao obter estatísticas do banco de dados' 
          : 'Error fetching database statistics'
      );
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      const result = await syncFrequentlyUsedMedications();
      
      if (result.success) {
        toast.success(
          language === 'pt' 
            ? 'Sincronização concluída com sucesso' 
            : 'Synchronization completed successfully',
          {
            description: language === 'pt'
              ? `${result.count} medicamentos sincronizados`
              : `${result.count} medications synchronized`
          }
        );
        
        fetchStats();
      } else {
        toast.error(
          language === 'pt' 
            ? 'Erro na sincronização' 
            : 'Synchronization error',
          {
            description: language === 'pt'
              ? 'Houve um problema ao sincronizar os dados'
              : 'There was a problem synchronizing the data'
          }
        );
      }
    } catch (error) {
      console.error('Error during synchronization:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro na sincronização' 
          : 'Synchronization error'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    
    try {
      const result = await clearExpiredCache();
      
      if (result) {
        toast.success(
          language === 'pt' 
            ? 'Cache limpo com sucesso' 
            : 'Cache cleared successfully'
        );
        
        fetchStats();
      } else {
        toast.error(
          language === 'pt' 
            ? 'Erro ao limpar cache' 
            : 'Error clearing cache'
        );
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro ao limpar cache' 
          : 'Error clearing cache'
      );
    } finally {
      setIsClearing(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '--';
    
    return new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === 'pt' ? 'Medicamentos' : 'Medications'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats.totalMedications.toLocaleString()}</div>
            <Progress className="h-1 mt-2" value={Math.min(dbStats.totalMedications / 100, 100)} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === 'pt' ? 'Mapeamentos ANVISA' : 'ANVISA Mappings'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats.totalMappings.toLocaleString()}</div>
            <Progress 
              className="h-1 mt-2" 
              value={Math.min((dbStats.totalMappings / dbStats.totalMedications) * 100, 100)} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === 'pt' ? 'Cache' : 'Cache'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats.totalCacheEntries.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-2">
              {language === 'pt' ? 'Última sincronização:' : 'Last sync:'}
              {' '}{formatDate(dbStats.lastSyncDate)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSync} disabled={isSyncing}>
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
          onClick={handleClearCache}
          disabled={isClearing || dbStats.totalCacheEntries === 0}
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
    </div>
  );
};

export default RxNormAdminPanel;
