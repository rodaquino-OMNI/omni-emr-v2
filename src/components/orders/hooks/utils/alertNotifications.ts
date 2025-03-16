
import { AlertTriangle, InfoIcon, Ban } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { OrderAlert } from '../types/orderAlerts';

/**
 * Shows a toast notification for critical alerts that cannot be overridden
 */
export const showCriticalToast = (alert: OrderAlert) => {
  toast({
    title: 'Critical Alert',
    description: alert.message,
    variant: 'destructive',
    icon: <AlertTriangle className="h-5 w-5" />,
    duration: 5000,
  });
};

/**
 * Shows a toast notification for warning alerts that can be overridden
 */
export const showWarningToast = (alert: OrderAlert) => {
  toast({
    title: 'Warning Alert',
    description: alert.message,
    variant: 'warning',
    icon: <InfoIcon className="h-5 w-5" />,
    duration: 4000,
  });
};

/**
 * Shows a toast notification for alerts that have been overridden
 */
export const showOverriddenToast = (alert: OrderAlert) => {
  toast({
    title: 'Alert Overridden',
    description: `${alert.message} - Reason: ${alert.overriddenReason || 'Not specified'}`,
    variant: 'info',
    icon: <Ban className="h-5 w-5" />,
    duration: 3000,
  });
};
