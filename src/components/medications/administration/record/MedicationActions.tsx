
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, X, AlertCircle, Droplets, Clipboard } from 'lucide-react';

interface MedicationActionsProps {
  recordId: string;
  status: string;
  isIV?: boolean;
  canAdminister: boolean;
  onAdminister: (id: string) => void;
  onHold: (id: string) => void;
  onMissed: (id: string) => void;
  onCalculateIV: (id: string) => void;
  hasAllergyWarning?: boolean;
  hasInteractionWarning?: boolean;
}

const MedicationActions: React.FC<MedicationActionsProps> = ({
  recordId,
  status,
  isIV,
  canAdminister,
  onAdminister,
  onHold,
  onMissed,
  onCalculateIV,
  hasAllergyWarning = false,
  hasInteractionWarning = false
}) => {
  const { t } = useTranslation();

  if (status !== 'scheduled' || !canAdminister) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <TooltipProvider>
        {/* Administer button with warning if applicable */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={hasAllergyWarning || hasInteractionWarning ? "destructive" : "outline"} 
              size="sm" 
              onClick={() => onAdminister(recordId)}
              className={hasAllergyWarning || hasInteractionWarning ? "border-red-500" : ""}
            >
              <Check className="h-3 w-3 mr-1" />
              {t('administer')}
            </Button>
          </TooltipTrigger>
          {(hasAllergyWarning || hasInteractionWarning) && (
            <TooltipContent className="bg-red-50 border-red-200 text-red-700">
              <p className="font-medium">Warning</p>
              {hasAllergyWarning && <p>Patient has allergy to this medication</p>}
              {hasInteractionWarning && <p>Potential drug interaction detected</p>}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Hold button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => onHold(recordId)}>
              <X className="h-3 w-3 mr-1" />
              {t('hold')}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hold this medication dose</p>
          </TooltipContent>
        </Tooltip>

        {/* Missed button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => onMissed(recordId)}>
              <AlertCircle className="h-3 w-3 mr-1" />
              {t('missed')}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mark this dose as missed</p>
          </TooltipContent>
        </Tooltip>

        {/* IV Calculator button */}
        {isIV && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => onCalculateIV(recordId)}>
                <Droplets className="h-3 w-3 mr-1" />
                {t('ivRate')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Calculate IV rate</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default MedicationActions;
