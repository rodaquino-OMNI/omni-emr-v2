
export type VitalType = 'heartRate' | 'bloodPressure' | 'temperature' | 'oxygenSaturation' | 'respiratoryRate' | 'bloodGlucose' | 'pain';
export type TimeRangeType = '24h' | '3d' | '7d' | '30d';

export interface VitalsChartProps {
  patientId: string;
  type: VitalType;
  timeRange?: TimeRangeType;
}

export interface VitalDataPoint {
  date: string;
  timestamp: string;
  value: any;
  isAbnormal: boolean;
}

export interface VitalChartConfig {
  label: string;
  unit: string;
  color: string;
  colorSecondary?: string;
  domain: [number, number];
  normalRange?: [number, number];
  normalSystolic?: [number, number];
  normalDiastolic?: [number, number];
  criticalLow?: number;
  criticalHigh?: number;
  criticalSystolic?: { low: number; high: number };
  criticalDiastolic?: { low: number; high: number };
}
