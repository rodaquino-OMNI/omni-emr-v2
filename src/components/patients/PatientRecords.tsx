
import React from 'react';

type PatientRecordsProps = {
  patientId: string;
};

const PatientRecords = ({ patientId }: PatientRecordsProps) => {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-medium mb-4">Medical Records</h2>
      <div className="text-center py-8 text-muted-foreground">
        Coming soon: Medical records for this patient
      </div>
    </div>
  );
};

export default PatientRecords;
