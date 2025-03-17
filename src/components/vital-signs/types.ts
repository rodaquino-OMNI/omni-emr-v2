
import { VitalSigns } from '@/types/patient';

export interface VitalSignsDisplayProps {
  vitals: VitalSigns;
  showTime?: boolean;
  isCompact?: boolean;
}

export interface VitalSignsChartProps {
  vitals: VitalSigns[];
  patientId?: string;
  timeRange?: string;
}
