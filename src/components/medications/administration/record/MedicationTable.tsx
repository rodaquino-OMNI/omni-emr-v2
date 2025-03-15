
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertCircle, Check, X, Clock, Info, Pill, Activity } from 'lucide-react';
import MedicationActions from './MedicationActions';
import MedicationDetails from './MedicationDetails';
import { AdministrationRecord, PatientData } from './types';

interface MedicationTableProps {
  administrationRecords: AdministrationRecord[];
  patientData: PatientData | null;
  canAdministerMedications: boolean;
  onAdminister: (id: string) => void;
  onHold: (id: string) => void;
  onMissed: (id: string) => void;
  onCalculateIV: (id: string) => void;
}

const MedicationTable: React.FC<MedicationTableProps> = ({
  administrationRecords,
  patientData,
  canAdministerMedications,
  onAdminister,
  onHold,
  onMissed,
  onCalculateIV
}) => {
  const { t } = useTranslation();

  const getStatusBadge = (status: AdministrationRecord['status']) => {
    switch (status) {
      case 'administered':
        return <Badge variant="success" className="flex items-center gap-1">
          <Check className="w-3 h-3" />
          {t('administered')}
        </Badge>;
      case 'missed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <X className="w-3 h-3" />
          {t('missed')}
        </Badge>;
      case 'held':
        return <Badge variant="warning" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {t('held')}
        </Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {t('scheduled')}
        </Badge>;
    }
  };
  
  const getMedicationTypeIcon = (type: string) => {
    switch (type) {
      case 'antibiotic':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <Activity className="w-3 h-3" />
          {t('antibiotic')}
        </Badge>;
      case 'analgesic':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Pill className="w-3 h-3" />
          {t('analgesic')}
        </Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {t('critical')}
        </Badge>;
      case 'prn':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {t('prn')}
        </Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
          <Pill className="w-3 h-3" />
          {t('regular')}
        </Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">{t('medications')}</th>
            <th className="py-2 text-left">{t('type')}</th>
            <th className="py-2 text-left">{t('dosage')}</th>
            <th className="py-2 text-left">{t('route')}</th>
            <th className="py-2 text-left">{t('scheduledTime')}</th>
            <th className="py-2 text-left">{t('status')}</th>
            <th className="py-2 text-left">{t('administeredBy')}</th>
            <th className="py-2 text-left">{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {administrationRecords.map((record) => (
            <tr key={record.id} className="border-b">
              <td className="py-3">
                <div className="flex items-center">
                  {record.medicationName}
                  
                  {patientData?.allergies.some(allergy => 
                    record.medicationName.toLowerCase().includes(allergy.toLowerCase())
                  ) && (
                    <Popover>
                      <PopoverTrigger>
                        <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-red-50 border-red-200">
                        <div className="font-semibold text-red-700">{t('allergyWarning')}</div>
                        <div className="text-red-600 mt-1">
                          {t('patientHasAllergy', { medication: record.medicationName })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </td>
              <td className="py-3">{getMedicationTypeIcon(record.medicationType || 'regular')}</td>
              <td className="py-3">{record.dosage}</td>
              <td className="py-3">
                <div className="flex items-center">
                  {record.route}
                  {record.isIV && (
                    <Popover>
                      <PopoverTrigger>
                        <Info className="h-4 w-4 ml-2 text-blue-500" />
                      </PopoverTrigger>
                      <PopoverContent className="w-60">
                        <div className="font-semibold">{t('ivDetails')}</div>
                        <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
                          <div>{t('rate')}:</div>
                          <div>{record.ivRate} mL/hr</div>
                          <div>{t('duration')}:</div>
                          <div>{record.ivDuration} min</div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </td>
              <td className="py-3">{record.scheduledTime}</td>
              <td className="py-3">{getStatusBadge(record.status)}</td>
              <td className="py-3">{record.administeredBy || '-'}</td>
              <td className="py-3">
                {record.status === 'scheduled' && canAdministerMedications && (
                  <MedicationActions
                    recordId={record.id}
                    status={record.status}
                    isIV={record.isIV}
                    canAdminister={canAdministerMedications}
                    onAdminister={onAdminister}
                    onHold={onHold}
                    onMissed={onMissed}
                    onCalculateIV={onCalculateIV}
                  />
                )}
                {(record.status === 'administered' || record.status === 'held' || record.status === 'missed') && (
                  <MedicationDetails
                    administeredBy={record.administeredBy}
                    administeredAt={record.administeredAt}
                    notes={record.notes}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicationTable;
