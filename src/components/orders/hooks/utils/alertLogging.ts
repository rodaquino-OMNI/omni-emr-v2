
import { Shield } from 'lucide-react';
import { OrderAlert } from '../types/orderAlerts';
import { toast } from '@/hooks/use-toast';

/**
 * Logs overridden alerts to the audit log system
 */
export const logAlertOverrides = async (userId: string | undefined, updatedAlerts: OrderAlert[]) => {
  try {
    // This is a placeholder for real implementation
    const { logAuditEvent, supabase } = await import('@/integrations/supabase/client');
    
    if (userId) {
      await logAuditEvent(
        userId,
        'alert_override',
        'medication_order',
        'system',
        { alerts: updatedAlerts }
      );
    }
    
    return true;
  } catch (error) {
    console.error('Failed to log alert overrides:', error);
    return false;
  }
};

/**
 * Shows a toast notification for alert overrides
 */
export const showAlertOverrideToast = (language: string) => {
  toast({
    title: language === 'pt' ? 'Alertas ignorados' : 'Alerts overridden',
    description: language === 'pt'
      ? 'Os alertas foram ignorados com uma justificativa clínica'
      : 'Alerts have been overridden with clinical justification',
    variant: "warning",
    icon: <Shield className="h-4 w-4 text-amber-600" />
  });
};

/**
 * Shows a toast notification for cancelled orders
 */
export const showOrderCancelledToast = (language: string) => {
  toast({
    title: language === 'pt' ? 'Pedido cancelado' : 'Order cancelled',
    description: language === 'pt'
      ? 'O pedido foi cancelado devido aos alertas de segurança'
      : 'The order was cancelled due to safety alerts',
    variant: "info"
  });
};
