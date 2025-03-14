
import React from 'react';
import VitalsChart from '@/components/ui/VitalsChart';

interface CurrentVitalsTabProps {
  patientId: string;
}

const CurrentVitalsTab: React.FC<CurrentVitalsTabProps> = ({ patientId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-4">
        <VitalsChart patientId={patientId} type="heartRate" timeRange="24h" />
      </div>
      <div className="glass-card p-4">
        <VitalsChart patientId={patientId} type="bloodPressure" timeRange="24h" />
      </div>
      <div className="glass-card p-4">
        <VitalsChart patientId={patientId} type="temperature" timeRange="24h" />
      </div>
      <div className="glass-card p-4">
        <VitalsChart patientId={patientId} type="oxygenSaturation" timeRange="24h" />
      </div>
      <div className="glass-card p-4">
        <VitalsChart patientId={patientId} type="respiratoryRate" timeRange="24h" />
      </div>
      <div className="glass-card p-4">
        <VitalsChart patientId={patientId} type="pain" timeRange="24h" />
      </div>
    </div>
  );
};

export default CurrentVitalsTab;
