
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface Sector {
  id: string;
  name: string;
  description: string;
}

const mockSectors: Sector[] = [
  {
    id: 'emergency',
    name: 'Emergency Department',
    description: 'Acute care and emergency services'
  },
  {
    id: 'inpatient',
    name: 'Inpatient Ward',
    description: 'General medical and surgical inpatient care'
  },
  {
    id: 'outpatient',
    name: 'Outpatient Clinic',
    description: 'Follow-up visits and non-emergency consultations'
  },
  {
    id: 'icu',
    name: 'Intensive Care Unit',
    description: 'Critical care for patients requiring close monitoring'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Medical care for infants, children and adolescents'
  }
];

const SectorSelection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedSector) {
      // In a real app, we would save the selected sector to context/state
      localStorage.setItem('selectedSector', selectedSector);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('selectSector')}</CardTitle>
          <CardDescription>
            {t('selectSectorDescription', 'Choose the hospital sector you want to work in')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedSector || ''}
            onValueChange={setSelectedSector}
            className="space-y-3"
          >
            {mockSectors.map((sector) => (
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
            disabled={!selectedSector}
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
