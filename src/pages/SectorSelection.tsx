
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';
import { useSectorContext } from '@/hooks/useSectorContext';

interface Sector {
  id: string;
  name: string;
  description: string;
}

const SectorSelection: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const { sectors, selectSector, isLoading } = useSectorContext();
  
  // Use sectors from context if available, otherwise use mock data
  const availableSectors = sectors.length > 0 ? sectors : [
    {
      id: 'emergency',
      name: language === 'pt' ? 'Departamento de Emergência' : 'Emergency Department',
      description: language === 'pt' ? 'Atendimento agudo e serviços de emergência' : 'Acute care and emergency services'
    },
    {
      id: 'inpatient',
      name: language === 'pt' ? 'Enfermaria de Internação' : 'Inpatient Ward',
      description: language === 'pt' ? 'Cuidados médicos e cirúrgicos para pacientes internados' : 'General medical and surgical inpatient care'
    },
    {
      id: 'outpatient',
      name: language === 'pt' ? 'Clínica Ambulatorial' : 'Outpatient Clinic',
      description: language === 'pt' ? 'Consultas de acompanhamento e consultas não emergenciais' : 'Follow-up visits and non-emergency consultations'
    },
    {
      id: 'icu',
      name: language === 'pt' ? 'Unidade de Terapia Intensiva' : 'Intensive Care Unit',
      description: language === 'pt' ? 'Cuidados intensivos para pacientes que necessitam de monitoramento contínuo' : 'Critical care for patients requiring close monitoring'
    },
    {
      id: 'pediatrics',
      name: language === 'pt' ? 'Pediatria' : 'Pediatrics',
      description: language === 'pt' ? 'Cuidados médicos para bebês, crianças e adolescentes' : 'Medical care for infants, children and adolescents'
    }
  ];

  const handleContinue = () => {
    if (selectedSector) {
      const sector = availableSectors.find(s => s.id === selectedSector);
      if (sector) {
        // If using the context
        if (sectors.length > 0) {
          selectSector({
            id: sector.id,
            name: sector.name,
            code: sector.id.toUpperCase().substring(0, 3),
            description: sector.description,
            is_active: true
          });
        } else {
          // Fallback to localStorage if context is not fully implemented
          localStorage.setItem('selectedSector', JSON.stringify({
            id: sector.id,
            name: sector.name,
            code: sector.id.toUpperCase().substring(0, 3),
            description: sector.description,
            is_active: true
          }));
        }
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
