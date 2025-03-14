
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMedicationData } from './detail/useMedicationData';
import MedicationHeader from './detail/MedicationHeader';
import MedicationInfo from './detail/MedicationInfo';
import AIInsightsSection from './detail/AIInsightsSection';
import MedicationNotFound from './detail/MedicationNotFound';

type MedicationDetailProps = {
  medicationId?: string;
};

const MedicationDetail = ({ medicationId }: MedicationDetailProps) => {
  const params = useParams();
  const id = medicationId || params.id;
  
  const { medication, formatDate, getStatusStyle } = useMedicationData(id);
  
  if (!medication) {
    return <MedicationNotFound />;
  }
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <MedicationHeader 
          medication={medication} 
          getStatusStyle={getStatusStyle} 
        />
        
        {/* Display AI insights if available */}
        <AIInsightsSection 
          patientId={medication.patientId} 
          medicationId={medication.id} 
        />
        
        <MedicationInfo 
          medication={medication} 
          formatDate={formatDate} 
        />
      </div>
    </div>
  );
};

export default MedicationDetail;
