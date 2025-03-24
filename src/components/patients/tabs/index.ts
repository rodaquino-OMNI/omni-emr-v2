
import { PatientTabProps } from '@/types/patient';
// Import the patient tab components
import PatientOverviewTab from './PatientOverviewTab';
import PatientRecordsTab from './PatientRecordsTab';
import PatientPrescriptionsTab from './PatientPrescriptionsTab';
import PatientAIInsightsTab from './PatientAIInsightsTab';
import PatientVitalSignsTab from './PatientVitalSignsTab';
import PatientAllergiesTab from './PatientAllergiesTab';
import PatientMedicationsTab from './PatientMedicationsTab';
import EnhancedPatientMedicationsTab from './EnhancedPatientMedicationsTab';
import PatientNotesTab from './PatientNotesTab';
import PatientCareTasksTab from './PatientCareTasksTab';
import PatientAppointmentsTab from './PatientAppointmentsTab';
import PatientFluidBalanceTab from './PatientFluidBalanceTab';

// Define interface for each tab with PatientTabProps
export interface PatientOverviewTabProps extends PatientTabProps {
  patient?: any;
}
export interface PatientRecordsTabProps extends PatientTabProps {}
export interface PatientPrescriptionsTabProps extends PatientTabProps {}
export interface PatientAIInsightsTabProps extends PatientTabProps {
  insights?: any[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onGenerateInsight?: () => void;
}
export interface PatientVitalSignsTabProps extends PatientTabProps {}
export interface PatientAllergiesTabProps extends PatientTabProps {}
export interface PatientMedicationsTabProps extends PatientTabProps {
  readOnly?: boolean;
}
export interface EnhancedPatientMedicationsTabProps extends PatientTabProps {
  compact?: boolean;
}
export interface PatientNotesTabProps extends PatientTabProps {
  filter?: string;
}
export interface PatientCareTasksTabProps extends PatientTabProps {}
export interface PatientAppointmentsTabProps extends PatientTabProps {
  compact?: boolean;
}
export interface PatientFluidBalanceTabProps extends PatientTabProps {}

export {
  PatientOverviewTab,
  PatientRecordsTab,
  PatientPrescriptionsTab,
  PatientAIInsightsTab,
  PatientVitalSignsTab,
  PatientAllergiesTab,
  PatientMedicationsTab,
  EnhancedPatientMedicationsTab,
  PatientNotesTab,
  PatientCareTasksTab,
  PatientAppointmentsTab,
  PatientFluidBalanceTab
};
