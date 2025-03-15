
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { MedicationAutocomplete } from '@/components/medications/MedicationAutocomplete';
import { MedicationSuggestion } from '@/hooks/useMedicationAutocomplete';
import { useTranslation } from '@/hooks/useTranslation';

const MedicationAutocompleteDemoPage = () => {
  const { t, language } = useTranslation();
  const [selectedMed, setSelectedMed] = useState<MedicationSuggestion | null>(null);
  
  const handleMedicationSelect = (medication: MedicationSuggestion) => {
    console.log('Selected medication:', medication);
    setSelectedMed(medication);
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medication Autocomplete Demo</h1>
        <LanguageSwitcher />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Simple Implementation</CardTitle>
            <CardDescription>
              Basic medication autocomplete with bilingual support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {language === 'pt' ? 'Medicamento' : 'Medication'}
              </label>
              <MedicationAutocomplete 
                onSelectMedication={handleMedicationSelect}
              />
            </div>
            
            {selectedMed && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-1">{language === 'pt' ? 'Selecionado:' : 'Selected:'}</h4>
                <div>
                  <div className="font-semibold">
                    {language === 'pt' && selectedMed.name_pt ? selectedMed.name_pt : selectedMed.name}
                  </div>
                  <div className="text-sm text-muted-foreground">RxCUI: {selectedMed.rxcui}</div>
                  {selectedMed.name_pt && selectedMed.name_pt !== selectedMed.name && (
                    <div className="text-sm">
                      {language === 'pt' ? 'Nome em inglês:' : 'English name:'} {selectedMed.name}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>With Context</CardTitle>
            <CardDescription>
              Medication autocomplete with patient/diagnosis context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {language === 'pt' ? 'Medicamento' : 'Medication'}
              </label>
              <MedicationAutocomplete 
                onSelectMedication={handleMedicationSelect}
                patientId="patient-123"
                doctorId="doctor-456"
                diagnosisCode="J45" // Asthma
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'pt' 
                  ? 'Com contexto de paciente e diagnóstico (J45 - Asma)' 
                  : 'With patient context and diagnosis (J45 - Asthma)'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Button variant="outline" onClick={() => window.history.back()}>
          {language === 'pt' ? 'Voltar' : 'Back'}
        </Button>
      </div>
    </div>
  );
};

export default MedicationAutocompleteDemoPage;
