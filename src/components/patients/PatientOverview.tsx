
import React from 'react';
import { cn } from '@/lib/utils';
import { Patient } from './PatientCard';
import { AIInsight } from '../ai/AIInsights';
import { useAuth } from '@/context/AuthContext';
import { samplePatients } from '@/data/samplePatients';

// Import the extracted components
import HealthStatusSummary from './overview/HealthStatusSummary';
import VitalSignsCard from './overview/VitalSignsCard';
import MedicationsCard from './overview/MedicationsCard';
import AppointmentsCard from './overview/AppointmentsCard';
import CareTimelineCard from './overview/CareTimelineCard';
import PatientQuickActions from './overview/PatientQuickActions';

type PatientOverviewProps = {
  patientId: string;
  insights?: AIInsight[];
  prescriptions?: any[];
  className?: string;
};

const PatientOverview = ({ patientId, insights = [], prescriptions = [], className }: PatientOverviewProps) => {
  const { user } = useAuth();
  const patient = samplePatients.find(p => p.id === patientId);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Health Status Summary */}
      <HealthStatusSummary patient={patient} />
      
      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VitalSignsCard patient={patient} />
        <MedicationsCard patient={patient} prescriptions={prescriptions} />
        <AppointmentsCard patient={patient} />
      </div>
      
      {/* Line of Care Visualization */}
      <CareTimelineCard patient={patient} />
      
      {/* Quick Actions */}
      <PatientQuickActions patient={patient} />
    </div>
  );
};

export default PatientOverview;
