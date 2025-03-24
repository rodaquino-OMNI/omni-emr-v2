import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { VitalSigns } from '@/types/patient';
import { useSectorContext } from '@/hooks/useSectorContext';
import { format, parseISO } from 'date-fns';

interface VitalSignsCardProps {
  limit?: number;
}

const VitalSignsCard: React.FC<VitalSignsCardProps> = ({ limit = 3 }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedSector } = useSectorContext();
  
  // Fetch recent vital signs for the sector
  const { data: vitalSigns = [], isLoading } = useQuery({
    queryKey: ['sectorVitalSigns', selectedSector?.id, limit],
    queryFn: async () => {
      if (!selectedSector?.id) return [];
      
      // Fetch patients in the sector
      const { data: patients } = await supabase
        .from('patients')
        .select('id')
        .eq('sector_id', selectedSector.id);
      
      if (!patients || patients.length === 0) return [];
      
      const patientIds = patients.map(p => p.id);
      
      // Fetch vital signs for these patients
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .in('patient_id', patientIds)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as VitalSigns[];
    },
    enabled: !!selectedSector?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handleViewAll = () => {
    navigate('/vital-signs');
  };
  
  const formatVitalSign = (vitalSign: VitalSigns) => {
    const bp = vitalSign.blood_pressure_systolic && vitalSign.blood_pressure_diastolic
      ? `${vitalSign.blood_pressure_systolic}/${vitalSign.blood_pressure_diastolic}`
      : vitalSign.systolic_bp && vitalSign.diastolic_bp
        ? `${vitalSign.systolic_bp}/${vitalSign.diastolic_bp}`
        : 'N/A';
    
    const o2 = vitalSign.oxygen_saturation ?? vitalSign.o2_saturation ?? 'N/A';
    const hr = vitalSign.heart_rate ?? 'N/A';
    const temp = vitalSign.temperature ?? 'N/A';
    
    return { bp, o2, hr, temp };
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2 text-primary" />
            {t('vitalSigns')}
          </CardTitle>
          <CardDescription>
            {t('recentVitalSigns')}
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleViewAll}
          className="text-xs"
        >
          {t('viewAll')}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {vitalSigns.length > 0 ? (
              vitalSigns.map(vitalSign => {
                const { bp, o2, hr, temp } = formatVitalSign(vitalSign);
                return (
                  <div 
                    key={vitalSign.id} 
                    className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/patients/${vitalSign.patient_id}?tab=vitals`)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Patient ID: {vitalSign.patient_id}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(vitalSign.timestamp), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">BP:</span> {bp}
                      </div>
                      <div>
                        <span className="text-muted-foreground">O₂:</span> {o2}%
                      </div>
                      <div>
                        <span className="text-muted-foreground">HR:</span> {hr} bpm
                      </div>
                      <div>
                        <span className="text-muted-foreground">Temp:</span> {temp}°C
                      </div>
                    </div>
                    <div className="flex justify-end mt-1">
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {t('noVitalSignsMessage', 'No vital signs recorded recently')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalSignsCard;