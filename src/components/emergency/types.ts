
export type TriageLevel = 'immediate' | 'emergent' | 'urgent' | 'semi-urgent' | 'non-urgent';

export interface EmergencyTriageWorkflowProps {
  patientId: string;
  patientName: string;
}
