
import React from 'react';
import { VitalType } from '../types/vitalsTypes';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TooltipProps {
  payload?: any[];
  label?: string;
  active?: boolean;
  type: VitalType;
  unit: string;
}

const VitalsChartTooltip: React.FC<TooltipProps> = ({ payload, label, active, type, unit }) => {
  const { t } = useTranslation();
  
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const isAbnormal = type === 'bloodPressure' 
    ? data.value.isAbnormal 
    : data.isAbnormal;

  return (
    <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md text-sm">
      <p className="font-medium">{label}</p>
      {type === 'bloodPressure' ? (
        <>
          <p className={`text-gray-700 ${data.value.isAbnormal ? 'font-semibold text-red-600' : ''}`}>
            {`${t('systolic')}: ${data.value.systolic} ${unit}`}
          </p>
          <p className={`text-gray-700 ${data.value.isAbnormal ? 'font-semibold text-red-600' : ''}`}>
            {`${t('diastolic')}: ${data.value.diastolic} ${unit}`}
          </p>
        </>
      ) : (
        <p className={`text-gray-700 ${data.isAbnormal ? 'font-semibold text-red-600' : ''}`}>
          {`${data.value} ${unit}`}
        </p>
      )}
      
      {isAbnormal && (
        <div className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>{t('abnormalValue')}</span>
        </div>
      )}
    </div>
  );
};

export default VitalsChartTooltip;
