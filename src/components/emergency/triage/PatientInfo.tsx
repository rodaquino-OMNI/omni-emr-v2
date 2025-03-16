
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface PatientInfoProps {
  patientName: string;
  patientId: string;
  chiefComplaint: string;
  setChiefComplaint: (value: string) => void;
  canPerformTriage: boolean;
}

const PatientInfo: React.FC<PatientInfoProps> = ({
  patientName,
  patientId,
  chiefComplaint,
  setChiefComplaint,
  canPerformTriage
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium mb-2">{t('patientInformation')}</h3>
      <p><strong>{t('name')}:</strong> {patientName}</p>
      <p><strong>{t('patientId')}:</strong> {patientId}</p>
      
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">{t('chiefComplaint')}</label>
        <textarea 
          className="w-full px-3 py-2 border rounded-md" 
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder={t('enterChiefComplaint')}
          disabled={!canPerformTriage}
          rows={2}
        />
      </div>
    </div>
  );
};

export default PatientInfo;
