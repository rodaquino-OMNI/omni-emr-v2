
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertTriangle, Weight } from 'lucide-react';

interface WeightBasedSectionProps {
  isWeightBased: boolean;
  isWeightVerified: boolean;
  patientWeight?: number;
  weightLastUpdated?: Date;
  onUpdateWeight: (weight: number) => Promise<boolean>;
}

export function WeightBasedSection({
  isWeightBased,
  isWeightVerified,
  patientWeight,
  weightLastUpdated,
  onUpdateWeight
}: WeightBasedSectionProps) {
  const { t } = useTranslation();
  const [newWeight, setNewWeight] = useState<string>('');
  const [isUpdatingWeight, setIsUpdatingWeight] = useState(false);
  
  // Only render if this is a weight-based medication
  if (!isWeightBased) return null;
  
  const handleWeightUpdate = async () => {
    if (!newWeight) return;
    
    setIsUpdatingWeight(true);
    const weight = parseFloat(newWeight);
    
    if (isNaN(weight) || weight <= 0) {
      setIsUpdatingWeight(false);
      return;
    }
    
    const success = await onUpdateWeight(weight);
    setIsUpdatingWeight(false);
    
    if (success) {
      setNewWeight('');
    }
  };
  
  // Format the date to a readable string
  const formatDate = (date?: Date) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium flex items-center">
          <Weight className="mr-2 h-4 w-4" />
          {t('weightBasedDosing')}
        </h3>
        {isWeightVerified ? (
          <span className="text-green-600 flex items-center text-sm">
            <CheckCircle className="mr-1 h-4 w-4" />
            {t('verifyPatientWeight')}
          </span>
        ) : (
          <span className="text-amber-600 flex items-center text-sm">
            <AlertTriangle className="mr-1 h-4 w-4" />
            {t('weightBasedDosingRequired')}
          </span>
        )}
      </div>
      
      {patientWeight && (
        <div className="flex justify-between text-sm mb-4">
          <span>
            {t('patientWeight')}: <strong>{patientWeight} kg</strong>
          </span>
          <span className="text-muted-foreground">
            {t('lastUpdated')}: {formatDate(weightLastUpdated)}
          </span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="weight">{t('updateWeight')}</Label>
        <div className="flex space-x-2">
          <Input
            id="weight"
            type="number"
            placeholder="kg"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
          />
          <Button 
            onClick={handleWeightUpdate} 
            disabled={isUpdatingWeight || !newWeight}
          >
            {isUpdatingWeight ? t('updating') : t('update')}
          </Button>
        </div>
      </div>
    </div>
  );
}
