
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Info, XCircle, CheckCircle, Shield, Brain } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';

interface AIVerificationModalProps {
  alerts: Array<{
    type: 'critical' | 'warning' | 'info';
    message: string;
    overridden: boolean;
  }>;
  onClose: () => void;
  onProceed: (proceed: boolean, overrideReasons?: {[key: number]: string}) => void;
}

const AIVerificationModal = ({ alerts, onClose, onProceed }: AIVerificationModalProps) => {
  const { language } = useTranslation();
  const [overrideReasons, setOverrideReasons] = useState<{[key: number]: string}>({});
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  const handleReasonChange = (index: number, reason: string) => {
    setOverrideReasons(prev => ({
      ...prev,
      [index]: reason
    }));
  };
  
  const hasCriticalAlerts = alerts.some(alert => alert.type === 'critical');
  const hasAlerts = alerts.length > 0;
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="bg-purple-100 p-1.5 rounded-full dark:bg-purple-900/60">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span>
              {language === 'pt' 
                ? 'Verificação de Segurança por IA' 
                : 'AI Safety Verification'
              }
            </span>
            <Badge variant="ai" className="ml-2">AI-Powered</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <div className="flex items-center gap-2 mb-4 bg-purple-50 p-3 rounded-md border border-purple-200 dark:bg-purple-950/30 dark:border-purple-800">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <p className="text-sm text-purple-800 dark:text-purple-300">
              {language === 'pt' 
                ? 'Nossa IA analisou sua prescrição e identificou os seguintes pontos de atenção:' 
                : 'Our AI has analyzed your order and identified the following points of attention:'
              }
            </p>
          </div>
          
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded-md border ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <Badge 
                        variant={alert.type === 'critical' ? 'destructive' : alert.type === 'warning' ? 'warning' : 'info'} 
                        className="ml-2 capitalize"
                      >
                        {alert.type}
                      </Badge>
                    </div>
                    
                    {(alert.type === 'critical' || alert.type === 'warning') && (
                      <div>
                        <Label htmlFor={`override-${index}`} className="text-xs">
                          {language === 'pt' 
                            ? 'Motivo para sobrepor este alerta:' 
                            : 'Reason for overriding this alert:'
                          }
                        </Label>
                        <Textarea
                          id={`override-${index}`}
                          placeholder={language === 'pt' 
                            ? 'Digite o motivo clínico...' 
                            : 'Enter clinical reason...'
                          }
                          value={overrideReasons[index] || ''}
                          onChange={(e) => handleReasonChange(index, e.target.value)}
                          className="mt-1 h-16 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between pt-2 border-t">
          <Button variant="outline" onClick={() => onClose()}>
            <XCircle className="mr-2 h-4 w-4" />
            {language === 'pt' ? 'Cancelar pedido' : 'Cancel order'}
          </Button>
          <Button 
            onClick={() => onProceed(true, overrideReasons)}
            variant={hasCriticalAlerts ? "destructive" : "default"}
            disabled={hasCriticalAlerts && !Object.keys(overrideReasons).length}
            className={!hasCriticalAlerts ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {language === 'pt' ? 'Confirmar e prosseguir' : 'Confirm and proceed'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIVerificationModal;
