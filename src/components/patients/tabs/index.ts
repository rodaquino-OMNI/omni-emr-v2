
import { PatientTabProps } from '@/types/patient';
// Import the patient tab components
import PatientOverviewTab from './PatientOverviewTab';
import PatientRecordsTab from './PatientRecordsTab';
import PatientPrescriptionsTab from './PatientPrescriptionsTab';
import PatientAIInsightsTab from './PatientAIInsightsTab';
import PatientVitalSignsTab from './PatientVitalSignsTab';
import PatientAllergiesTab from './PatientAllergiesTab';
import PatientMedicationsTab from './PatientMedicationsTab';

// Define interface for each tab with PatientTabProps
export interface PatientOverviewTabProps extends PatientTabProps {}
export interface PatientRecordsTabProps extends PatientTabProps {}
export interface PatientPrescriptionsTabProps extends PatientTabProps {}
export interface PatientAIInsightsTabProps extends PatientTabProps {
  insights?: any[];
  isLoading?: boolean;
}
export interface PatientVitalSignsTabProps extends PatientTabProps {}
export interface PatientAllergiesTabProps extends PatientTabProps {}
export interface PatientMedicationsTabProps extends PatientTabProps {
  readOnly?: boolean;
}
export interface PatientNotesTabProps extends PatientTabProps {
  filter?: string;
}

export {
  PatientOverviewTab,
  PatientRecordsTab,
  PatientPrescriptionsTab,
  PatientAIInsightsTab,
  PatientVitalSignsTab,
  PatientAllergiesTab,
  PatientMedicationsTab
};
