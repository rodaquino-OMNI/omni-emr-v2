
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { VitalSigns } from '@/pages/VisitNotes';
import { Activity, Thermometer, Heart, Droplet, Wind, Zap } from 'lucide-react';

interface VitalSignsViewProps {
  vitalSigns: VitalSigns;
}

const VitalSignsView: React.FC<VitalSignsViewProps> = ({ vitalSigns }) => {
  const { language } = useTranslation();
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div>
      <h3 className="font-medium mb-4">
        {language === 'pt' ? 'Sinais Vitais' : 'Vital Signs'}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {vitalSigns.heartRate !== undefined && (
          <div className="p-3 bg-slate-50 rounded-lg flex flex-col items-center justify-center">
            <Heart className="h-5 w-5 text-red-500 mb-1" />
            <div className="text-lg font-semibold">{vitalSigns.heartRate}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'pt' ? 'bpm' : 'bpm'}
            </div>
          </div>
        )}
        
        {vitalSigns.bloodPressure && (
          <div className="p-3 bg-slate-50 rounded-lg flex flex-col items-center justify-center">
            <Activity className="h-5 w-5 text-blue-500 mb-1" />
            <div className="text-lg font-semibold">{vitalSigns.bloodPressure}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'pt' ? 'mmHg' : 'mmHg'}
            </div>
          </div>
        )}
        
        {vitalSigns.temperature !== undefined && (
          <div className="p-3 bg-slate-50 rounded-lg flex flex-col items-center justify-center">
            <Thermometer className="h-5 w-5 text-orange-500 mb-1" />
            <div className="text-lg font-semibold">{vitalSigns.temperature}°</div>
            <div className="text-xs text-muted-foreground">
              {language === 'pt' ? 'Temperatura' : 'Temp'}
            </div>
          </div>
        )}
        
        {vitalSigns.oxygenSaturation !== undefined && (
          <div className="p-3 bg-slate-50 rounded-lg flex flex-col items-center justify-center">
            <Droplet className="h-5 w-5 text-blue-400 mb-1" />
            <div className="text-lg font-semibold">{vitalSigns.oxygenSaturation}%</div>
            <div className="text-xs text-muted-foreground">
              {language === 'pt' ? 'SpO2' : 'SpO2'}
            </div>
          </div>
        )}
        
        {vitalSigns.respiratoryRate !== undefined && (
          <div className="p-3 bg-slate-50 rounded-lg flex flex-col items-center justify-center">
            <Wind className="h-5 w-5 text-teal-500 mb-1" />
            <div className="text-lg font-semibold">{vitalSigns.respiratoryRate}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'pt' ? 'resp/min' : 'resp/min'}
            </div>
          </div>
        )}
        
        {vitalSigns.painLevel !== undefined && (
          <div className="p-3 bg-slate-50 rounded-lg flex flex-col items-center justify-center">
            <Zap className="h-5 w-5 text-amber-500 mb-1" />
            <div className="text-lg font-semibold">{vitalSigns.painLevel}/10</div>
            <div className="text-xs text-muted-foreground">
              {language === 'pt' ? 'Dor' : 'Pain'}
            </div>
          </div>
        )}
      </div>
      
      {vitalSigns.recordedAt && (
        <div className="mt-4 text-sm text-muted-foreground">
          {language === 'pt' ? 'Registrado em: ' : 'Recorded at: '}
          {formatDate(vitalSigns.recordedAt)}
          {vitalSigns.recordedBy && (
            <span> {language === 'pt' ? 'por' : 'by'} {vitalSigns.recordedBy}</span>
          )}
        </div>
      )}
      
      {vitalSigns.notes && (
        <div className="mt-4">
          <h4 className="text-sm font-medium">
            {language === 'pt' ? 'Observações:' : 'Notes:'}
          </h4>
          <p className="text-sm mt-1">{vitalSigns.notes}</p>
        </div>
      )}
    </div>
  );
};

export default VitalSignsView;
