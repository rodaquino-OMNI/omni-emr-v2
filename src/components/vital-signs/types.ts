
import { VitalSigns } from '@/types/patientTypes';

export interface VitalSignsDisplayProps {
  vitals: VitalSigns;
  showTime?: boolean;
  isCompact?: boolean;
}

export interface VitalSignsChartProps {
  vitalSigns: VitalSigns[];
  patientId: string;
  timeRange?: string;
}
