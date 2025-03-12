
import React from 'react';
import VitalsChart from '../ui/VitalsChart';

type PatientVitalsProps = {
  patientId: string;
};

const PatientVitals = ({ patientId }: PatientVitalsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <VitalsChart patientId={patientId} type="heartRate" />
      </div>
      <div>
        <VitalsChart patientId={patientId} type="bloodPressure" />
      </div>
      <div>
        <VitalsChart patientId={patientId} type="temperature" />
      </div>
      <div>
        <VitalsChart patientId={patientId} type="oxygenSaturation" />
      </div>
    </div>
  );
};

export default PatientVitals;
