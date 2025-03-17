
import React from 'react';
import { PatientTabProps } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HealthStatusSummary from '../overview/HealthStatusSummary';
import VitalSignsCard from '../overview/VitalSignsCard';
import MedicationsCard from '../overview/MedicationsCard';
import AppointmentsCard from '../overview/AppointmentsCard';
import PatientQuickActions from '../overview/PatientQuickActions';
import CareTimelineCard from '../overview/CareTimelineCard';
import { PatientStatus } from '@/types/patient';

export interface PatientOverviewTabProps extends PatientTabProps {
  patient: any; // Using any temporarily to avoid circular dependency issues
}

const PatientOverviewTab: React.FC<PatientOverviewTabProps> = ({ patientId, patient }) => {
  if (!patient) {
    return <div className="p-4 text-red-500">Patient data not available</div>;
  }

  // Determine if patient status is critical or unstable
  const hasCriticalStatus = patient.status === 'critical';

  return (
    <div className="space-y-6">
      {/* Health Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <HealthStatusSummary patient={patient} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="hidden md:block">
        <PatientQuickActions patient={patient} />
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vital Signs */}
        <VitalSignsCard patient={patient} />

        {/* Medications */}
        <MedicationsCard patient={patient} />
      </div>

      {/* Timeline */}
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Care Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <CareTimelineCard patient={patient} />
          </CardContent>
        </Card>
      </div>

      {/* Appointments */}
      <div className="mt-6">
        <AppointmentsCard patient={patient} />
      </div>
    </div>
  );
};

export default PatientOverviewTab;
