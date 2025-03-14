
import React, { useState } from 'react';
import { CriticalResult, CriticalResultAlert } from './CriticalResultAlert';
import { useTranslation } from '@/hooks/useTranslation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CriticalResultDetail } from './CriticalResultDetail';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CriticalResultsListProps {
  results: CriticalResult[];
  onAcknowledge: (resultId: string) => Promise<void>;
  isLoading?: boolean;
}

export function CriticalResultsList({ 
  results, 
  onAcknowledge,
  isLoading = false
}: CriticalResultsListProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('unacknowledged');
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  
  const handleAcknowledge = async (resultId: string) => {
    await onAcknowledge(resultId);
  };
  
  const handleView = (resultId: string) => {
    setSelectedResultId(resultId);
  };
  
  const closeDetail = () => {
    setSelectedResultId(null);
  };
  
  const selectedResult = results.find(r => r.id === selectedResultId);
  
  const filteredResults = results.filter(result => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !result.acknowledged;
    if (filter === 'acknowledged') return result.acknowledged;
    return true;
  });
  
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-muted-foreground">{t('loadingCriticalResults')}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4">
        <RadioGroup 
          value={filter} 
          onValueChange={(value) => setFilter(value as any)} 
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unacknowledged" id="unacknowledged" />
            <Label htmlFor="unacknowledged">{t('unacknowledged')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="acknowledged" id="acknowledged" />
            <Label htmlFor="acknowledged">{t('acknowledged')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">{t('all')}</Label>
          </div>
        </RadioGroup>
      </div>
      
      {filteredResults.length === 0 ? (
        <div className="py-8 text-center border rounded-md bg-gray-50">
          <p className="text-muted-foreground">
            {filter === 'all' 
              ? t('noCriticalResults') 
              : filter === 'unacknowledged' 
                ? t('noUnacknowledgedResults') 
                : t('noAcknowledgedResults')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map(result => (
            <CriticalResultAlert
              key={result.id}
              result={result}
              onAcknowledge={handleAcknowledge}
              onView={handleView}
            />
          ))}
        </div>
      )}
      
      <Dialog open={selectedResultId !== null} onOpenChange={closeDetail}>
        <DialogContent className="sm:max-w-lg">
          {selectedResult && (
            <CriticalResultDetail 
              result={selectedResult} 
              onClose={closeDetail}
              onAcknowledge={() => handleAcknowledge(selectedResult.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
