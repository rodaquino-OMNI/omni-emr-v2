
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderType } from '@/types/orders';
import { Shield } from 'lucide-react';
import { generateMockAlerts } from './utils/mockAlertGenerator';
import { OrderAlert } from './types/orderAlerts';

export const useAlertVerification = (
  setAlerts: React.Dispatch<React.SetStateAction<OrderAlert[]>>,
  setShowAIModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { language } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for alerts
  const checkForAlerts = useCallback(async (activeTab: OrderType, orderData: any) => {
    if (isSubmitting) return { hasAlerts: false, alerts: [] };
    
    setIsSubmitting(true);
    
    try {
      // Show toast to indicate AI is analyzing the order
      toast({
        title: language === 'pt' ? 'Verificando pedido' : 'Verifying order',
        description: language === 'pt' 
          ? 'Nossa IA está analisando o pedido para garantir a segurança' 
          : 'Our AI is analyzing the order to ensure safety',
        variant: "default",
        icon: { icon: Shield, className: "h-4 w-4 text-purple-600" }
      });
      
      // In a real app, this would call a Supabase function or API endpoint
      // that uses an AI service to check for alerts
      try {
        // Try connecting to Supabase for AI alerts
        // This is a placeholder for real implementation
        const supabase = (await import('@/integrations/supabase/client')).supabase;
        
        // Check if Supabase is available by running a simple query
        const { error } = await supabase.from('profiles').select('id').limit(1);
        
        if (!error) {
          // Simulating API call with timeout for demo purposes
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real implementation, we would call a Supabase Edge Function here
          // const { data, error } = await supabase.functions.invoke('check-medication-alerts', {
          //   body: { orderData, activeTab }
          // });
          //
          // if (error) throw error;
          // 
          // const newAlerts = data.alerts;
        }
      } catch (error) {
        console.error('Error connecting to Supabase for AI alerts:', error);
        // Continue with mock alerts if Supabase is unavailable
      }
      
      // Generate mock alerts for demo purposes
      const newAlerts = generateMockAlerts(activeTab, orderData);
      
      // Update state with new alerts
      setAlerts(newAlerts);
      
      // Determine if we need to show the AI modal
      const hasAlerts = newAlerts.length > 0;
      setShowAIModal(hasAlerts);
      
      // Show success toast if no alerts were found
      if (!hasAlerts) {
        toast({
          title: language === 'pt' ? 'Verificação concluída' : 'Verification completed',
          description: language === 'pt'
            ? 'Nenhum problema foi encontrado pela IA'
            : 'No issues were found by the AI',
          variant: "success",
          icon: { icon: Shield, className: "h-4 w-4 text-green-600" }
        });
      }
      
      return { hasAlerts, alerts: newAlerts };
      
    } catch (error) {
      console.error('Error checking for alerts:', error);
      
      // Show error toast
      toast({
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' 
          ? 'Falha ao verificar alertas. Deseja prosseguir mesmo assim?' 
          : 'Failed to check for alerts. Do you want to proceed anyway?',
        variant: "destructive"
      });
      
      return { hasAlerts: false, alerts: [] };
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, language, setAlerts, setShowAIModal]);

  return {
    isSubmitting,
    checkForAlerts
  };
};
