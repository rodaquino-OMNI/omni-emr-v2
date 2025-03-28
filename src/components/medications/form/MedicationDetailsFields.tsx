
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Database } from 'lucide-react';
import MedicationTextField from './MedicationTextField';
import RxNormMedicationSelector from '../RxNormMedicationSelector';
import { MedicationAutocomplete } from '../MedicationAutocomplete';
import { MedicationSuggestion } from '@/hooks/useMedicationAutocomplete';

interface MedicationDetailsFieldsProps {
  name: string;
  dosage: string;
  frequency: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDosageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFrequencyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MedicationDetailsFields = ({
  name,
  dosage,
  frequency,
  onNameChange,
  onDosageChange,
  onFrequencyChange
}: MedicationDetailsFieldsProps) => {
  const { t, language } = useTranslation();
  const [isRxNormOpen, setIsRxNormOpen] = useState(false);
  const [isUsingLegacySelector, setIsUsingLegacySelector] = useState(false);

  // Handle selection from the new autocomplete
  const handleMedicationSelect = (medication: MedicationSuggestion) => {
    // Create a synthetic event to pass to the original handler
    const event = {
      target: {
        value: language === 'pt' && medication.name_pt ? medication.name_pt : medication.name,
        // Add FHIR-specific data as custom properties
        fhirData: {
          coding: [{
            system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            code: medication.rxcui || "",
            display: medication.name
          }],
          text: medication.name
        }
      }
    } as React.ChangeEvent<HTMLInputElement> & { 
      target: { fhirData?: any }
    };
    
    // Pass the enriched event to the original handler
    onNameChange(event);
    
    // Auto-fill dosage if available
    if (medication.strength) {
      const strengthEvent = {
        target: {
          value: medication.strength
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onDosageChange(strengthEvent);
    }
  };

  // Handle selection from the legacy RxNorm selector
  const handleLegacyMedicationSelect = (medication: any) => {
    // Using RxNorm data for FHIR compliance
    
    // Create a synthetic event to pass to the original handler
    const event = {
      target: {
        value: medication.name,
        // Add FHIR-specific data as custom properties
        fhirData: {
          coding: [{
            system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            code: medication.rxcui || "",
            display: medication.name
          }],
          text: medication.name
        }
      }
    } as React.ChangeEvent<HTMLInputElement> & { 
      target: { fhirData?: any }
    };
    
    // Pass the enriched event to the original handler
    onNameChange(event);
    
    // Auto-fill dosage if available
    if (medication.details?.strengths?.[0]?.name) {
      const strengthEvent = {
        target: {
          value: medication.details.strengths[0].name
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onDosageChange(strengthEvent);
    }
    
    setIsRxNormOpen(false);
    setIsUsingLegacySelector(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start gap-2">
        <div className="flex-1">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            {t('medication')}
          </label>
          <MedicationAutocomplete
            initialSearchTerm={name}
            onSelectMedication={handleMedicationSelect}
            className="w-full"
          />
        </div>
        <Dialog open={isRxNormOpen} onOpenChange={setIsRxNormOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="mt-6 whitespace-nowrap"
              type="button"
              onClick={() => setIsUsingLegacySelector(true)}
            >
              <Database className="h-4 w-4 mr-1" />
              {t('advancedSearch')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('advancedSearch')}</DialogTitle>
            </DialogHeader>
            {isUsingLegacySelector && (
              <RxNormMedicationSelector 
                onMedicationSelect={handleLegacyMedicationSelect}
                initialSearchTerm={name}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MedicationTextField
          id="dosage"
          label={t('dosage')}
          value={dosage}
          onChange={onDosageChange}
          placeholder={language === 'pt' ? "Ex: 500mg" : "Ex: 500mg"}
        />
        <MedicationTextField
          id="frequency"
          label={t('frequency')}
          value={frequency}
          onChange={onFrequencyChange}
          placeholder={language === 'pt' ? "Ex: 3 vezes ao dia" : "Ex: 3 times daily"}
        />
      </div>
    </div>
  );
};

export default MedicationDetailsFields;
