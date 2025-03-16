
import { toast } from '@/hooks/use-toast';
import { Language } from '@/types/auth';
import { syncFrequentlyUsedMedications, clearExpiredCache } from '@/services/rxnorm';

/**
 * Synchronize frequently used medications with RxNorm API
 */
export const syncMedications = async (language: Language): Promise<boolean> => {
  try {
    const result = await syncFrequentlyUsedMedications();
    
    if (result.success) {
      toast({
        title: language === 'pt' 
          ? 'Sincronização concluída com sucesso' 
          : 'Synchronization completed successfully',
        description: language === 'pt'
          ? `${result.count} medicamentos sincronizados`
          : `${result.count} medications synchronized`,
        variant: 'success'
      });
      
      return true;
    } else {
      toast({
        title: language === 'pt' 
          ? 'Erro na sincronização' 
          : 'Synchronization error',
        description: language === 'pt'
          ? 'Houve um problema ao sincronizar os dados'
          : 'There was a problem synchronizing the data',
        variant: 'error'
      });
      
      return false;
    }
  } catch (error) {
    console.error('Error during synchronization:', error);
    toast({
      title: language === 'pt' 
        ? 'Erro na sincronização' 
        : 'Synchronization error',
      variant: 'error'
    });
    
    return false;
  }
};

/**
 * Clear expired cache entries
 */
export const clearCache = async (language: Language): Promise<boolean> => {
  try {
    const result = await clearExpiredCache();
    
    if (result.success) {
      toast({
        title: language === 'pt' 
          ? 'Cache limpo com sucesso' 
          : 'Cache cleared successfully',
        variant: 'success'
      });
      
      return true;
    } else {
      toast({
        title: language === 'pt' 
          ? 'Erro ao limpar cache' 
          : 'Error clearing cache',
        variant: 'error'
      });
      
      return false;
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
    toast({
      title: language === 'pt' 
        ? 'Erro ao limpar cache' 
        : 'Error clearing cache',
      variant: 'error'
    });
    
    return false;
  }
};
