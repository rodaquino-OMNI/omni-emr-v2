
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Medal, Clock } from 'lucide-react';
import MedicationAdministrationRecord from '@/components/medications/administration/MedicationAdministrationRecord';

// Mock data for the patient list
const MOCK_PATIENTS = [
  { id: '1', name: 'John Doe', mrn: 'MRN001', age: 45, gender: 'Male', roomNumber: '101', medsDue: 3 },
  { id: '2', name: 'Jane Smith', mrn: 'MRN002', age: 32, gender: 'Female', roomNumber: '102', medsDue: 0 },
  { id: '3', name: 'Michael Johnson', mrn: 'MRN003', age: 58, gender: 'Male', roomNumber: '103', medsDue: 1 },
  { id: '4', name: 'Sarah Williams', mrn: 'MRN004', age: 29, gender: 'Female', roomNumber: '201', medsDue: 2 },
];

interface MedicationDetailSectionProps {
  selectedPatient: string | null;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  language: string;
}

const MedicationDetailSection: React.FC<MedicationDetailSectionProps> = ({ 
  selectedPatient, 
  selectedTab,
  setSelectedTab,
  language
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>
              {selectedPatient 
                ? MOCK_PATIENTS.find(p => p.id === selectedPatient)?.name + ' - ' + t('medications')
                : t('medications')}
            </CardTitle>
            
            {selectedPatient && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800/30">
                  <Medal className="h-3.5 w-3.5" />
                  {language === 'pt' ? 'Verificado por IA' : 'AI-Verified'}
                </Badge>
              </div>
            )}
          </div>
          
          {selectedPatient && (
            <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="mt-3">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="scheduled">
                  {t('scheduled') || 'Scheduled'}
                </TabsTrigger>
                <TabsTrigger value="prn">
                  {t('prn') || 'PRN'}
                </TabsTrigger>
                <TabsTrigger value="administered">
                  {t('administered') || 'Administered'}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </CardHeader>
        
        <CardContent>
          {selectedPatient ? (
            <div className="pt-2">
              <MedicationAdministrationRecord patientId={selectedPatient} />
            </div>
          ) : (
            <EmptyMedicationState />
          )}
        </CardContent>
        
        {selectedPatient && (
          <CardFooter className="border-t pt-4 flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{language === 'pt' ? 'Última atualização:' : 'Last updated:'} 2 {language === 'pt' ? 'minutos atrás' : 'minutes ago'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              <span>{language === 'pt' ? 'Verificação de segurança ativa' : 'Safety verification active'}</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

// Separate component for empty state
const EmptyMedicationState = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Shield className="h-16 w-16 mb-4 text-muted-foreground/30" />
      <p className="font-medium mb-2">
        {t('selectPatientToViewMedications')}
      </p>
      <p className="text-sm max-w-md text-center">
        {t('selectPatientDescription')}
      </p>
    </div>
  );
};

export default MedicationDetailSection;
