
import React from 'react';
import { User, UserRound } from 'lucide-react';
import { Prescription } from '@/services/prescriptions';

type ParticipantInfoProps = {
  prescription: Prescription;
};

const ParticipantInfo = ({ prescription }: ParticipantInfoProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 border-t border-border pt-6">
      <div>
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <User className="h-4 w-4" />
          Patient Information
        </h3>
        <div className="rounded-md border border-border bg-card p-4">
          <div className="text-sm mb-1">
            <span className="font-medium">Name:</span> {prescription.patientName}
          </div>
          <div className="text-sm">
            <span className="font-medium">ID:</span> {prescription.patientId}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          Prescriber Information
        </h3>
        <div className="rounded-md border border-border bg-card p-4">
          <div className="text-sm mb-1">
            <span className="font-medium">Name:</span> {prescription.doctorName}
          </div>
          <div className="text-sm">
            <span className="font-medium">ID:</span> {prescription.doctorId}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantInfo;
