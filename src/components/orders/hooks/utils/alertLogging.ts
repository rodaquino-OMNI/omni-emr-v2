
import { supabase } from '@/integrations/supabase/client';
import { OrderAlert } from '../types/orderAlerts';
import { toast } from '@/hooks/use-toast';

/**
 * Log alert overrides to the audit system
 */
export const logAlertOverrides = async (userId: string | undefined, alerts: OrderAlert[]) => {
  if (!userId) return;
  
  try {
    // Log to console for development
    console.log('Logging alert overrides:', { userId, alerts });
    
    // In a real implementation, we'd use a proper table like:
    // await supabase
    //   .from('alert_overrides')  // Use a table that exists in your schema
    //   .insert(alerts.map(alert => ({
    //     alert_id: alert.id,
    //     user_id: userId,
    //     alert_type: alert.type,
    //     reason: alert.overriddenReason,
    //     created_at: new Date().toISOString()
    //   })));
  } catch (error) {
    console.error('Failed to log alert overrides:', error);
  }
};

/**
 * Show a toast when alerts are overridden
 */
export const showAlertOverrideToast = (language: string) => {
  toast({
    title: language === 'pt' ? 'Alertas confirmados' : 'Alerts acknowledged',
    description: language === 'pt' 
      ? 'Os alertas foram confirmados e o pedido foi enviado' 
      : 'Alerts have been acknowledged and the order has been submitted',
    variant: "success"
  });
};

/**
 * Show a toast when an order is cancelled
 */
export const showOrderCancelledToast = (language: string) => {
  toast({
    title: language === 'pt' ? 'Pedido cancelado' : 'Order cancelled',
    description: language === 'pt' 
      ? 'O pedido foi cancelado' 
      : 'The order has been cancelled',
    variant: "destructive"
  });
};
