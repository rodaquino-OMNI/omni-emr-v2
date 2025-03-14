
import React from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VitalsChart from '@/components/ui/VitalsChart';
import { Patient } from '../PatientCard';
import { useTranslation } from '@/hooks/useTranslation';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';

type VitalSignsCardProps = {
  patient: Patient;
};

const VitalSignsCard = ({ patient }: VitalSignsCardProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const permissions = usePermissions(user);
  
  const canViewVitals = permissions.hasPermission('view_vitals') || 
                      permissions.hasPermission('view_own_vitals');
  
  if (!canViewVitals) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            {t('vitals')}
          </CardTitle>
          <Link to={`/vitals?patientId=${patient.id}`} className="text-sm text-primary flex items-center hover:underline">
            {t('viewHistory')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <CardDescription>{t('lastRecordedTime')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white shadow-sm border border-border rounded-md p-3 hover:shadow-md transition-shadow">
              <div className="text-xs text-muted-foreground">{t('bloodPressure')}</div>
              <div className="text-lg font-semibold mt-1">120/80 mmHg</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {t('normal')}
              </div>
            </div>
            <div className="bg-white shadow-sm border border-border rounded-md p-3 hover:shadow-md transition-shadow">
              <div className="text-xs text-muted-foreground">{t('heartRate')}</div>
              <div className="text-lg font-semibold mt-1">78 bpm</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {t('normal')}
              </div>
            </div>
            <div className="bg-white shadow-sm border border-border rounded-md p-3 hover:shadow-md transition-shadow">
              <div className="text-xs text-muted-foreground">{t('temperature')}</div>
              <div className="text-lg font-semibold mt-1">36.7 °C</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {t('normal')}
              </div>
            </div>
            <div className="bg-white shadow-sm border border-border rounded-md p-3 hover:shadow-md transition-shadow">
              <div className="text-xs text-muted-foreground">{t('oxygenSaturation')}</div>
              <div className="text-lg font-semibold mt-1">98%</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {t('normal')}
              </div>
            </div>
          </div>
          
          <div className="h-44 mt-2">
            <VitalsChart patientId={patient.id} type="heartRate" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSignsCard;
