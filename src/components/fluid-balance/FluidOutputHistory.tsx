
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { FluidOutput, fluidOutputLabels } from '@/utils/fluidTypes';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { ArrowUpCircle } from 'lucide-react';

interface FluidOutputHistoryProps {
  patientId: string;
  refreshTrigger?: number;
}

const FluidOutputHistory: React.FC<FluidOutputHistoryProps> = ({ patientId, refreshTrigger = 0 }) => {
  const { language } = useTranslation();
  const [outputs, setOutputs] = useState<FluidOutput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOutputs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!supabase) {
          throw new Error('Database connection not available');
        }
        
        // Add type assertion to handle the fluid_outputs table not being in the types
        const { data, error: fetchError } = await supabase
          .from('fluid_outputs')
          .select('*')
          .eq('patient_id', patientId)
          .order('timestamp', { ascending: false }) as { data: any[]; error: any };
          
        if (fetchError) {
          throw fetchError;
        }
        
        const formattedOutputs = data.map(output => ({
          id: output.id,
          patientId: output.patient_id,
          timestamp: new Date(output.timestamp),
          amount: output.amount,
          type: output.type,
          notes: output.notes,
          recordedBy: output.recorded_by
        }));
        
        setOutputs(formattedOutputs);
      } catch (err) {
        console.error('Error fetching fluid outputs:', err);
        setError(language === 'pt' 
          ? 'Erro ao carregar registros de saída de líquidos' 
          : 'Error loading fluid output records');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOutputs();
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
          {language === 'pt' ? 'Histórico de Saídas de Líquidos' : 'Fluid Output History'}
        </CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Registros recentes de saídas de líquidos' 
            : 'Recent fluid output records'}
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
        ) : outputs.length === 0 ? (
          <div className="text-center text-muted-foreground p-6">
            <ArrowUpCircle className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p>
              {language === 'pt' 
                ? 'Nenhum registro de saída de líquidos encontrado' 
                : 'No fluid output records found'}
            </p>
            <p className="text-sm mt-1">
              {language === 'pt' 
                ? 'Use o formulário acima para registrar uma nova saída' 
                : 'Use the form above to record a new output'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {outputs.map((output) => (
              <div 
                key={output.id} 
                className="flex items-start p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="mr-3 mt-0.5">
                  <ArrowUpCircle className="h-5 w-5 text-rose-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {fluidOutputLabels[output.type][language === 'pt' ? 'pt' : 'en']}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {formatDate(output.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm font-bold mt-1">
                    {output.amount} ml
                  </p>
                  {output.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {output.notes}
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

export default FluidOutputHistory;
