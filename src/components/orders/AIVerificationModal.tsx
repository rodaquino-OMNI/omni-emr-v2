
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

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
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
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
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            {language === 'pt' 
              ? 'Verificação de Segurança da IA' 
              : 'AI Safety Verification'
            }
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'pt' 
              ? 'A inteligência artificial identificou os seguintes alertas para esta prescrição:' 
              : 'The AI has identified the following alerts for this order:'
            }
          </p>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
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
                    <p className="text-sm font-medium">{alert.message}</p>
                    
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
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onClose()}>
            <XCircle className="mr-2 h-4 w-4" />
            {language === 'pt' ? 'Cancelar pedido' : 'Cancel order'}
          </Button>
          <Button 
            onClick={() => onProceed(true, overrideReasons)}
            variant={hasCriticalAlerts ? "destructive" : "default"}
            disabled={hasCriticalAlerts && !Object.keys(overrideReasons).length}
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
