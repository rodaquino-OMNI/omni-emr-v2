
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';
import { useSectorContext } from '@/hooks/useSectorContext';

const SectorSelection: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const { sectors, selectSector, isLoading, fetchSectors } = useSectorContext();
  
  // Fetch sectors on component mount
  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);
  
  // Define fallback sectors for when context is empty
  const fallbackSectors = [
    {
      id: 'emergency',
      name: language === 'pt' ? 'Emergência' : 'Emergency',
      description: language === 'pt' ? 'Departamento de emergência para atendimento urgente' : 'Emergency department for urgent care',
      code: 'EMG',
      is_active: true
    },
    {
      id: 'icu',
      name: language === 'pt' ? 'UTI' : 'ICU',
      description: language === 'pt' ? 'Unidade de Terapia Intensiva para pacientes críticos' : 'Intensive Care Unit for critical patients',
      code: 'ICU',
      is_active: true
    },
    {
      id: 'general',
      name: language === 'pt' ? 'Enfermaria Geral' : 'General Medical',
      description: language === 'pt' ? 'Enfermaria médica geral para internação padrão' : 'General medical ward for standard inpatient care',
      code: 'GEN',
      is_active: true
    },
    {
      id: 'outpatient',
      name: language === 'pt' ? 'Ambulatório' : 'Outpatient',
      description: language === 'pt' ? 'Clínicas e serviços ambulatoriais' : 'Outpatient clinics and services',
      code: 'OUT',
      is_active: true
    },
    {
      id: 'homecare',
      name: language === 'pt' ? 'Cuidados Domiciliares' : 'Home Care',
      description: language === 'pt' ? 'Serviços de cuidados remotos para pacientes em casa' : 'Remote care services for patients at home',
      code: 'HMC',
      is_active: true
    }
  ];

  // Use context sectors if available, otherwise use fallback
  const availableSectors = sectors.length > 0 
    ? sectors 
    : fallbackSectors;

  const handleContinue = () => {
    if (selectedSector) {
      const sector = availableSectors.find(s => s.id === selectedSector);
      if (sector) {
        selectSector(sector);
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('selectSector')}</CardTitle>
          <CardDescription>
            {t('selectSectorDescription')}
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
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            disabled={!selectedSector || isLoading}
            onClick={handleContinue}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('loading', 'Loading...')}
              </span>
            ) : t('continue')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SectorSelection;
