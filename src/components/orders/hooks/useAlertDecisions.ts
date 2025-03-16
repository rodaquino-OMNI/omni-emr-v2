
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderAlert } from './types/orderAlerts';
import { Shield } from 'lucide-react';

export const useAlertDecisions = (alerts: OrderAlert[], setAlerts: React.Dispatch<React.SetStateAction<OrderAlert[]>>) => {
  const { language } = useTranslation();
  
  // Handle alert decisions
  const handleAlertsDecision = useCallback((proceed: boolean, overrideReasons?: {[key: number]: string}) => {
    if (proceed && overrideReasons) {
      // Update alerts with override reasons
      const updatedAlerts = alerts.map((alert, index) => ({
        ...alert,
        overridden: true,
        overriddenReason: overrideReasons[index] || 'Clinical decision'
      }));
      
      setAlerts(updatedAlerts);
      
      // Show a toast to acknowledge the alert override
      toast({
        title: language === 'pt' ? 'Alertas ignorados' : 'Alerts overridden',
        description: language === 'pt'
          ? 'Os alertas foram ignorados com uma justificativa clínica'
          : 'Alerts have been overridden with clinical justification',
        variant: "warning",
        icon: <Shield className="h-4 w-4 text-amber-600" />
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
      toast({
        title: language === 'pt' ? 'Pedido cancelado' : 'Order cancelled',
        description: language === 'pt'
          ? 'O pedido foi cancelado devido aos alertas de segurança'
          : 'The order was cancelled due to safety alerts',
        variant: "info"
      });
    }
    
    return proceed ? alerts : null;
  }, [alerts, language, setAlerts]);

  return { handleAlertsDecision };
};
