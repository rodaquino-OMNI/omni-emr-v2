
import { AlertTriangle, Info, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { OrderAlert } from '../types/orderAlerts';

/**
 * Shows a toast notification for order alerts
 */
export const showAlertToast = (alert: OrderAlert, language: string) => {
  const variant = alert.severity === 'critical' ? 'destructive' : 
                 alert.severity === 'moderate' ? 'warning' : 'info';
  
  const icon = alert.severity === 'critical' ? <AlertTriangle className="h-4 w-4" /> :
              alert.severity === 'moderate' ? <Info className="h-4 w-4" /> :
              <Check className="h-4 w-4" />;
  
  toast({
    title: language === 'pt' ? 'Alerta encontrado' : 'Alert found',
    description: alert.message,
    variant,
    icon
  });
};

/**
 * Logs alerts to console for debugging
 */
export const logAlerts = (alerts: OrderAlert[]) => {
  if (alerts.length === 0) {
    console.log('No alerts found');
    return;
  }
  
  console.log(`Found ${alerts.length} alerts:`);
  alerts.forEach(alert => {
    console.log(`- [${alert.severity.toUpperCase()}] ${alert.message}`);
  });
};
