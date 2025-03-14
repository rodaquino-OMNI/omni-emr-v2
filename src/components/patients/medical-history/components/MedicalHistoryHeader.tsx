
import React from 'react';
import { Shield } from 'lucide-react';

interface MedicalHistoryHeaderProps {
  children: React.ReactNode;
}

const MedicalHistoryHeader = ({ children }: MedicalHistoryHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-medium">Medical History</h2>
        <div className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          <Shield className="h-3 w-3" />
          FHIR Compliant
        </div>
      </div>
      {children}
    </div>
  );
};

export default MedicalHistoryHeader;
