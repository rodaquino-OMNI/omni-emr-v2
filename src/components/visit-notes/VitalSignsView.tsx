
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Heart, Activity, Thermometer, Wind, Droplet, BarChart2 } from 'lucide-react';
import type { VitalSigns } from '@/services/visitNotes/visitNoteService';

interface VitalSignsViewProps {
  vitalSigns: VitalSigns;
  showHeader?: boolean;
}

const VitalSignsView: React.FC<VitalSignsViewProps> = ({ vitalSigns, showHeader = true }) => {
  const { t, language } = useTranslation();
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="w-full">
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {language === 'pt' ? 'Sinais Vitais' : 'Vital Signs'}
          </CardTitle>
          {vitalSigns.recordedAt && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              {language === 'pt' ? 'Registrado em:' : 'Recorded at:'} {formatDate(vitalSigns.recordedAt)}
              {vitalSigns.recordedBy && ` ${language === 'pt' ? 'por' : 'by'} ${vitalSigns.recordedBy}`}
            </div>
          )}
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vitalSigns.heartRate !== undefined && (
            <div className="flex items-start gap-2">
              <Heart className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt' ? 'Frequência Cardíaca' : 'Heart Rate'}
                </p>
                <p className="text-lg font-medium">{vitalSigns.heartRate} bpm</p>
              </div>
            </div>
          )}
          
          {vitalSigns.bloodPressure && (
            <div className="flex items-start gap-2">
              <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt' ? 'Pressão Arterial' : 'Blood Pressure'}
                </p>
                <p className="text-lg font-medium">{vitalSigns.bloodPressure} mmHg</p>
              </div>
            </div>
          )}
          
          {vitalSigns.temperature !== undefined && (
            <div className="flex items-start gap-2">
              <Thermometer className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt' ? 'Temperatura' : 'Temperature'}
                </p>
                <p className="text-lg font-medium">{vitalSigns.temperature} °C</p>
              </div>
            </div>
          )}
          
          {vitalSigns.respiratoryRate !== undefined && (
            <div className="flex items-start gap-2">
              <Wind className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt' ? 'Frequência Respiratória' : 'Respiratory Rate'}
                </p>
                <p className="text-lg font-medium">{vitalSigns.respiratoryRate} {language === 'pt' ? 'rpm' : 'bpm'}</p>
              </div>
            </div>
          )}
          
          {vitalSigns.oxygenSaturation !== undefined && (
            <div className="flex items-start gap-2">
              <Droplet className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt' ? 'Saturação de Oxigênio' : 'Oxygen Saturation'}
                </p>
                <p className="text-lg font-medium">{vitalSigns.oxygenSaturation}%</p>
              </div>
            </div>
          )}
          
          {vitalSigns.painLevel !== undefined && (
            <div className="flex items-start gap-2">
              <BarChart2 className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt' ? 'Nível de Dor' : 'Pain Level'}
                </p>
                <p className="text-lg font-medium">{vitalSigns.painLevel}/10</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSignsView;
