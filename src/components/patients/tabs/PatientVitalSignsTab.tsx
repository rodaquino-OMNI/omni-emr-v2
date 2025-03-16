
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import VitalSignsForm from '@/components/visit-notes/VitalSignsForm';
import VitalSignsView from '@/components/visit-notes/VitalSignsView';
import { toast } from 'sonner';

interface PatientVitalSignsTabProps {
  patientId: string;
}

const PatientVitalSignsTab: React.FC<PatientVitalSignsTabProps> = ({ patientId }) => {
  const { t, language } = useTranslation();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch vital signs for the patient
  const { data: vitalSigns, isLoading, error } = useQuery({
    queryKey: ['vitalSigns', patientId],
    queryFn: async () => {
      // This would be a real API call in production
      // Simulating fetching vital signs for this patient
      return [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          heartRate: 72,
          bloodPressure: '120/80',
          temperature: 37.0,
          respiratoryRate: 16,
          oxygenSaturation: 98,
          painLevel: 0,
          recordedBy: 'Nurse Smith'
        }
      ];
    }
  });

  const handleVitalSignsSuccess = () => {
    setIsFormDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['vitalSigns', patientId] });
    toast.success(language === 'pt' ? 'Sinais vitais registrados com sucesso' : 'Vital signs recorded successfully');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {language === 'pt'
          ? 'Erro ao carregar sinais vitais'
          : 'Error loading vital signs'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{t('vitalSigns')}</h2>
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              {t('recordVitalSigns')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <VitalSignsForm
              patientName={patientId} // This would use the actual patient name in production
              onClose={() => setIsFormDialogOpen(false)}
              onSuccess={handleVitalSignsSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {vitalSigns && vitalSigns.length > 0 ? (
        <div className="space-y-4">
          {vitalSigns.map((vs, index) => (
            <Card key={vs.id || index}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {new Date(vs.timestamp).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VitalSignsView vitalSigns={vs} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          {language === 'pt'
            ? 'Nenhum registro de sinais vitais encontrado.'
            : 'No vital signs records found.'}
        </div>
      )}
    </div>
  );
};

export default PatientVitalSignsTab;
