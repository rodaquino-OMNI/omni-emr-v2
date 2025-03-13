
import React from 'react';
import VitalsChart from '../ui/VitalsChart';
import AIInsights from '../ai/AIInsights';
import { useAIInsights } from '@/hooks/useAIInsights';

type PatientVitalsProps = {
  patientId: string;
};

const PatientVitals = ({ patientId }: PatientVitalsProps) => {
  // Get AI insights specifically for vitals
  const { insights } = useAIInsights(patientId, ['vitals']);
  
  return (
    <div className="space-y-6">
      {/* Display vital-specific AI insights if available */}
      {insights.length > 0 && (
        <AIInsights 
          insights={insights}
          showSource={false}
        />
      )}
      
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
