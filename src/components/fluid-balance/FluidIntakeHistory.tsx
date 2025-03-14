
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { FluidIntake, fluidTypeLabels } from '@/utils/fluidTypes';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Droplet } from 'lucide-react';

interface FluidIntakeHistoryProps {
  patientId: string;
  refreshTrigger?: number;
}

const FluidIntakeHistory: React.FC<FluidIntakeHistoryProps> = ({ patientId, refreshTrigger = 0 }) => {
  const { language } = useTranslation();
  const [intakes, setIntakes] = useState<FluidIntake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchIntakes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!supabase) {
          throw new Error('Database connection not available');
        }
        
        const { data, error: fetchError } = await supabase
          .from('fluid_intakes')
          .select('*')
          .eq('patient_id', patientId)
          .order('timestamp', { ascending: false }) as { data: any[]; error: any };
          
        if (fetchError) {
          throw fetchError;
        }
        
        const formattedIntakes = data.map(intake => ({
          id: intake.id,
          patientId: intake.patient_id,
          timestamp: new Date(intake.timestamp),
          amount: intake.amount,
          type: intake.type,
          notes: intake.notes,
          recordedBy: intake.recorded_by
        }));
        
        setIntakes(formattedIntakes);
      } catch (err) {
        console.error('Error fetching fluid intakes:', err);
        setError(language === 'pt' 
          ? 'Erro ao carregar registros de entrada de líquidos' 
          : 'Error loading fluid intake records');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIntakes();
  }, [patientId, language, refreshTrigger]);
  
  const formatDate = (date: Date) => {
    return format(
      date,
      'PPp',
      { locale: language === 'pt' ? ptBR : enUS }
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {language === 'pt' ? 'Histórico de Entradas de Líquidos' : 'Fluid Intake History'}
        </CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Registros recentes de entradas de líquidos' 
            : 'Recent fluid intake records'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-pulse text-muted-foreground">
              {language === 'pt' ? 'Carregando...' : 'Loading...'}
            </div>
          </div>
        ) : error ? (
          <div className="text-destructive text-center p-4">
            {error}
          </div>
        ) : intakes.length === 0 ? (
          <div className="text-center text-muted-foreground p-6">
            <Droplet className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p>
              {language === 'pt' 
                ? 'Nenhum registro de entrada de líquidos encontrado' 
                : 'No fluid intake records found'}
            </p>
            <p className="text-sm mt-1">
              {language === 'pt' 
                ? 'Use o formulário acima para registrar uma nova entrada' 
                : 'Use the form above to record a new intake'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {intakes.map((intake) => (
              <div 
                key={intake.id} 
                className="flex items-start p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="mr-3 mt-0.5">
                  <Droplet className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {fluidTypeLabels[intake.type][language === 'pt' ? 'pt' : 'en']}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {formatDate(intake.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm font-bold mt-1">
                    {intake.amount} ml
                  </p>
                  {intake.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {intake.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FluidIntakeHistory;
