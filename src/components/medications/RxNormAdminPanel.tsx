
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseBackup, RefreshCw, Database, Globe, Trash2 } from 'lucide-react';
import { useRxNormStats } from './admin/useRxNormStats';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/core';
import { 
  getAllPortugueseNameMappings, 
  verifyPortugueseNameMapping,
  deletePortugueseNameMapping,
  getPortugueseTranslationsCount
} from '@/services/rxnorm/rxnormLanguageMapping';
import { MedicationNameMapping } from '@/services/rxnorm/rxnormLanguageMapping';

const RxNormAdminPanel = () => {
  const { language } = useTranslation();
  const { 
    dbStats, 
    isSyncing,
    isClearing,
    handleSync, 
    handleClearCache 
  } = useRxNormStats();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [portugalMappings, setPortugalMappings] = useState<MedicationNameMapping[]>([]);
  const [isLoadingMappings, setIsLoadingMappings] = useState(false);
  const [translationsCount, setTranslationsCount] = useState(0);
  
  // Load Portuguese mappings when tab is selected
  useEffect(() => {
    if (activeTab === 'translations') {
      loadPortugueseMappings();
      loadTranslationsCount();
    }
  }, [activeTab]);
  
  const loadPortugueseMappings = async () => {
    setIsLoadingMappings(true);
    try {
      const mappings = await getAllPortugueseNameMappings();
      setPortugalMappings(mappings);
    } catch (error) {
      console.error('Error loading Portuguese mappings:', error);
      toast.error('Failed to load Portuguese translations');
    } finally {
      setIsLoadingMappings(false);
    }
  };
  
  const loadTranslationsCount = async () => {
    try {
      const count = await getPortugueseTranslationsCount();
      setTranslationsCount(count);
    } catch (error) {
      console.error('Error getting translations count:', error);
    }
  };
  
  const handleVerifyMapping = async (id: string) => {
    try {
      const success = await verifyPortugueseNameMapping(id);
      if (success) {
        // Refresh the list
        await loadPortugueseMappings();
      }
    } catch (error) {
      console.error('Error verifying mapping:', error);
      toast.error('Failed to verify translation');
    }
  };
  
  const handleDeleteMapping = async (id: string) => {
    if (confirm('Are you sure you want to delete this translation?')) {
      try {
        const success = await deletePortugueseNameMapping(id);
        if (success) {
          // Refresh the list
          await loadPortugueseMappings();
          await loadTranslationsCount();
        }
      } catch (error) {
        console.error('Error deleting mapping:', error);
        toast.error('Failed to delete translation');
      }
    }
  };

  const formatLastSync = () => {
    if (!dbStats.lastSyncDate) return 'Never';
    
    return formatDistanceToNow(new Date(dbStats.lastSyncDate), { 
      addSuffix: true,
      locale: language === 'pt' ? ptBR : enUS
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            {language === 'pt' ? 'Visão Geral' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="translations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {language === 'pt' ? 'Traduções' : 'Translations'}
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <DatabaseBackup className="h-4 w-4" />
            {language === 'pt' ? 'Manutenção' : 'Maintenance'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'pt' ? 'Medicamentos Cadastrados' : 'Registered Medications'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dbStats.totalMedications}</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'pt' ? 'Total na base de dados' : 'Total in database'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'pt' ? 'Mapeamentos ANVISA' : 'ANVISA Mappings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dbStats.totalMappings}</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'pt' ? 'Códigos ANVISA mapeados' : 'ANVISA codes mapped'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'pt' ? 'Traduções PT-BR' : 'Portuguese Translations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{translationsCount}</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'pt' ? 'Medicamentos traduzidos' : 'Translated medications'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'pt' ? 'Estatísticas do Cache' : 'Cache Statistics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">
                    {dbStats.totalCacheEntries} {language === 'pt' ? 'entradas em cache' : 'cache entries'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'pt' ? 'Última sincronização: ' : 'Last sync: '} 
                    {formatLastSync()}
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleClearCache}
                  disabled={isClearing}
                >
                  {isClearing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {language === 'pt' ? 'Limpar Cache' : 'Clear Cache'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="translations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'pt' ? 'Traduções Português-Brasil' : 'Portuguese-Brazil Translations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMappings ? (
                <div className="flex justify-center p-4">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : portugalMappings.length > 0 ? (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium text-sm">
                          {language === 'pt' ? 'RxNorm' : 'RxNorm'}
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-sm">
                          {language === 'pt' ? 'Nome em Inglês' : 'English Name'}
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-sm">
                          {language === 'pt' ? 'Nome em Português' : 'Portuguese Name'}
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-sm">
                          {language === 'pt' ? 'Verificado' : 'Verified'}
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-sm">
                          {language === 'pt' ? 'Ações' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {portugalMappings.map((mapping) => (
                        <tr key={mapping.id} className="border-b">
                          <td className="px-4 py-2 text-sm">{mapping.rxnormCode}</td>
                          <td className="px-4 py-2 text-sm">{mapping.englishName}</td>
                          <td className="px-4 py-2 text-sm font-medium">{mapping.portugueseName}</td>
                          <td className="px-4 py-2 text-sm">
                            {mapping.isVerified ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {language === 'pt' ? 'Sim' : 'Yes'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {language === 'pt' ? 'Não' : 'No'}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex items-center gap-2">
                              {!mapping.isVerified && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8"
                                  onClick={() => handleVerifyMapping(mapping.id)}
                                >
                                  {language === 'pt' ? 'Verificar' : 'Verify'}
                                </Button>
                              )}
                              <Button 
                                variant="destructive" 
                                size="sm"
                                className="h-8"
                                onClick={() => handleDeleteMapping(mapping.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {language === 'pt' ? 'Nenhuma tradução encontrada' : 'No translations found'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'pt' ? 'Manutenção do Banco de Dados' : 'Database Maintenance'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">
                    {language === 'pt' ? 'Sincronizar Medicamentos' : 'Synchronize Medications'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'pt' 
                      ? 'Sincroniza medicamentos frequentemente usados com a API RxNorm' 
                      : 'Synchronizes frequently used medications with the RxNorm API'}
                  </p>
                </div>
                
                <Button
                  className="gap-2"
                  onClick={handleSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {language === 'pt' ? 'Sincronizar' : 'Sync Now'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">
                    {language === 'pt' ? 'Limpar Cache Expirado' : 'Clear Expired Cache'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'pt' 
                      ? 'Remove entradas de cache antigas para liberar espaço' 
                      : 'Removes old cache entries to free up space'}
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleClearCache}
                  disabled={isClearing}
                >
                  {isClearing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {language === 'pt' ? 'Limpar' : 'Clear'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RxNormAdminPanel;
