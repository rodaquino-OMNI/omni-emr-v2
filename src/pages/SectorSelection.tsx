
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';
import { useSectorContext } from '@/hooks/useSectorContext';
import { EmptyState } from '@/components/ui/empty-state';
import SectorSelectionSkeleton from '@/components/sector/SectorSelectionSkeleton';

const SectorSelection: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const { sectors, selectSector, isLoading, error, fetchSectors, isCacheStale } = useSectorContext();
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch sectors on component mount
  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);
  
  // Define available sectors
  const availableSectors = sectors.length > 0 ? sectors : [];

  const handleContinue = () => {
    if (selectedSector) {
      const sector = availableSectors.find(s => s.id === selectedSector);
      if (sector) {
        selectSector(sector);
        navigate('/dashboard');
      }
    }
  };

  // Handle refresh with debounce to prevent multiple toasts
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    await fetchSectors();
    
    // Reset refreshing state after a delay
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // If loading, show skeleton loader
  if (isLoading) {
    return <SectorSelectionSkeleton />;
  }

  // If error and no sectors, show error state
  if (error && availableSectors.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('sectorsUnavailable', 'Sectors Unavailable')}</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              variant="error"
              title={t('unableToLoadSectors', 'Unable to Load Sectors')}
              description={error}
              actionLabel={t('retry', 'Retry')}
              onAction={handleRefresh}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('selectSector', 'Select Sector')}</CardTitle>
            {isCacheStale && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                title={t('refreshSectors', 'Refresh Sectors')}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
          <CardDescription>
            {t('selectSectorDescription', 'Please select the sector where you will be working')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900">
            <ShieldAlert className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">
              {language === 'pt' ? 'Conformidade HIPAA' : 'HIPAA Compliance'}
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              {language === 'pt' 
                ? 'Suas escolhas de setor são registradas para fins de conformidade e auditoria.'
                : 'Your sector choices are logged for compliance and auditing purposes.'}
            </AlertDescription>
          </Alert>
          
          {availableSectors.length === 0 ? (
            <EmptyState
              title={t('noSectorsAvailable', 'No Sectors Available')}
              description={t('noSectorsDescription', 'There are no active sectors available at the moment.')}
              actionLabel={t('refresh', 'Refresh')}
              onAction={handleRefresh}
            />
          ) : (
            <RadioGroup
              value={selectedSector || ''}
              onValueChange={setSelectedSector}
              className="space-y-3"
            >
              {availableSectors.map((sector) => (
                <div key={sector.id} className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value={sector.id} id={sector.id} />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={sector.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {sector.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {sector.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            disabled={!selectedSector || isLoading}
            onClick={handleContinue}
          >
            {t('continue', 'Continue')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SectorSelection;
