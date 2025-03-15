
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '../PatientCard';
import { useTranslation } from '@/hooks/useTranslation';

type CareTimelineCardProps = {
  patient: Patient;
};

const CareTimelineCard = ({ patient }: CareTimelineCardProps) => {
  const { t, language } = useTranslation();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          {language === 'pt' ? 'Cronograma de Cuidados' : 'Care Timeline'}
        </CardTitle>
        <CardDescription>
          {language === 'pt' ? 'Jornada de cuidados do paciente' : "Patient's care journey"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-indigo-200 pl-6 py-2 space-y-6">
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-indigo-600"></div>
            <div className="bg-indigo-50 p-3 rounded-md">
              <div className="text-sm font-medium">
                {language === 'pt' ? 'Admissão Hospitalar' : 'Hospital Admission'}
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'pt' ? '7 dias atrás' : '7 days ago'}
              </div>
              <div className="text-xs mt-2">
                {language === 'pt' 
                  ? `Apresentação inicial com sintomas de ${patient.diagnosis}. Admitido para avaliação e tratamento.`
                  : `Initial presentation with symptoms of ${patient.diagnosis}. Admitted for evaluation and treatment.`
                }
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-blue-600"></div>
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm font-medium">
                {language === 'pt' ? 'Tratamento Iniciado' : 'Treatment Initiated'}
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'pt' ? '6 dias atrás' : '6 days ago'}
              </div>
              <div className="text-xs mt-2">
                {language === 'pt'
                  ? 'Iniciado regime de medicação. Resposta inicial monitorada.'
                  : 'Started on medication regimen. Initial response monitored.'
                }
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-green-600"></div>
            <div className="bg-green-50 p-3 rounded-md">
              <div className="text-sm font-medium">
                {language === 'pt' ? 'Condição Melhorando' : 'Condition Improving'}
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'pt' ? '3 dias atrás' : '3 days ago'}
              </div>
              <div className="text-xs mt-2">
                {language === 'pt'
                  ? 'Mostrando sinais de melhora. Medicação ajustada.'
                  : 'Showing signs of improvement. Medication adjusted.'
                }
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-purple-600"></div>
            <div className="bg-purple-50 p-3 rounded-md">
              <div className="text-sm font-medium">
                {language === 'pt' ? 'Fase Atual' : 'Current Phase'}
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'pt' ? 'Hoje' : 'Today'}
              </div>
              <div className="text-xs mt-2">
                {language === 'pt'
                  ? 'Tratamento continuado com monitoramento. Preparando para planejamento de alta.'
                  : 'Continued treatment with monitoring. Preparing for discharge planning.'
                }
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-gray-300"></div>
            <div className="border border-dashed border-gray-300 p-3 rounded-md">
              <div className="text-sm font-medium text-muted-foreground">
                {language === 'pt' ? 'Alta Planejada' : 'Planned Discharge'}
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'pt' ? 'Em 3 dias (estimado)' : 'In 3 days (estimated)'}
              </div>
              <div className="text-xs mt-2 text-muted-foreground">
                {language === 'pt'
                  ? 'Alta esperada com plano de acompanhamento.'
                  : 'Expected discharge with follow-up care plan.'
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareTimelineCard;
