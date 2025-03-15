
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderType } from '@/types/orders';
import { Shield } from 'lucide-react';

export interface OrderAlert {
  type: 'critical' | 'warning' | 'info';
  message: string;
  overridden: boolean;
  overriddenReason?: string;
}

export const useOrderAlertsCheck = () => {
  const { language } = useTranslation();
  const [alerts, setAlerts] = useState<OrderAlert[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  
  // Generate mock alerts based on order data
  const generateMockAlerts = useCallback((activeTab: OrderType, orderData: any): OrderAlert[] => {
    if (activeTab === 'medication') {
      const medicationName = orderData.medication?.medicationName?.toLowerCase() || '';
      
      const alertsToReturn: OrderAlert[] = [];
      
      if (medicationName.includes('warfarin') || medicationName.includes('coumadin')) {
        alertsToReturn.push({
          type: 'warning',
          message: 'Potential interaction with patient\'s current aspirin therapy. Consider monitoring INR more frequently.',
          overridden: false
        });
      } 
      
      if (medicationName.includes('penicillin') || medicationName.includes('amoxicillin')) {
        alertsToReturn.push({
          type: 'critical',
          message: 'Patient has documented penicillin allergy. Consider alternative antibiotic.',
          overridden: false
        });
      } 
      
      if (medicationName && Math.random() > 0.5) {
        // Random warning for demo purposes
        alertsToReturn.push({
          type: 'info',
          message: 'This medication may cause drowsiness. Advise patient to avoid driving.',
          overridden: false
        });
      }
      
      return alertsToReturn;
    }
    
    return [];
  }, []);
  
  // Check for alerts
  const checkForAlerts = useCallback(async (activeTab: OrderType, orderData: any) => {
    if (isSubmitting) return { hasAlerts: false, alerts: [] };
    
    setIsSubmitting(true);
    
    try {
      // Show toast to indicate AI is analyzing the order
      toast(language === 'pt' ? 'Verificando pedido' : 'Verifying order', {
        description: language === 'pt' 
          ? 'Nossa IA está analisando o pedido para garantir a segurança' 
          : 'Our AI is analyzing the order to ensure safety',
        icon: <Shield className="h-4 w-4 text-purple-600" />,
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
        toast.success(language === 'pt' ? 'Verificação concluída' : 'Verification completed', {
          description: language === 'pt'
            ? 'Nenhum problema foi encontrado pela IA'
            : 'No issues were found by the AI',
          icon: <Shield className="h-4 w-4 text-green-600" />,
        });
      }
      
      return { hasAlerts, alerts: newAlerts };
      
    } catch (error) {
      console.error('Error checking for alerts:', error);
      
      // Show error toast
      toast.error(language === 'pt' ? 'Erro' : 'Error', {
        description: language === 'pt' 
          ? 'Falha ao verificar alertas. Deseja prosseguir mesmo assim?' 
          : 'Failed to check for alerts. Do you want to proceed anyway?'
      });
      
      return { hasAlerts: false, alerts: [] };
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, language, generateMockAlerts]);
  
  // Handle alert decisions
  const handleAlertsDecision = useCallback((proceed: boolean, overrideReasons?: {[key: number]: string}) => {
    setShowAIModal(false);
    
    if (proceed && overrideReasons) {
      // Update alerts with override reasons
      const updatedAlerts = alerts.map((alert, index) => ({
        ...alert,
        overridden: true,
        overriddenReason: overrideReasons[index] || 'Clinical decision'
      }));
      
      setAlerts(updatedAlerts);
      
      // Show a toast to acknowledge the alert override
      toast.warning(language === 'pt' ? 'Alertas ignorados' : 'Alerts overridden', {
        description: language === 'pt'
          ? 'Os alertas foram ignorados com uma justificativa clínica'
          : 'Alerts have been overridden with clinical justification',
        icon: <Shield className="h-4 w-4 text-amber-600" />,
      });
      
      // In a real app, we would log these overrides to the audit log
      try {
        // This is a placeholder for real implementation
        import('@/integrations/supabase/client').then(({ logAuditEvent, supabase }) => {
          supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
              logAuditEvent(
                data.user.id,
                'alert_override',
                'medication_order',
                'system',
                { alerts: updatedAlerts }
              );
            }
          });
        });
      } catch (error) {
        console.error('Failed to log alert overrides:', error);
      }
      
      return updatedAlerts;
    }
    
    if (!proceed) {
      toast.info(language === 'pt' ? 'Pedido cancelado' : 'Order cancelled', {
        description: language === 'pt'
          ? 'O pedido foi cancelado devido aos alertas de segurança'
          : 'The order was cancelled due to safety alerts'
      });
    }
    
    return proceed ? alerts : null;
  }, [alerts, language]);
  
  return {
    alerts,
    setAlerts,
    isSubmitting,
    showAIModal,
    setShowAIModal,
    checkForAlerts,
    handleAlertsDecision
  };
};
