
import { VitalSigns } from '@/types/patientTypes';

type VitalType = keyof Omit<VitalSigns, 'id' | 'patient_id' | 'timestamp' | 'taken_by'>;

const vitalRanges: Record<string, { min: number; max: number }> = {
  temperature: { min: 36.5, max: 37.5 },
  heart_rate: { min: 60, max: 100 },
  blood_pressure_systolic: { min: 90, max: 140 },
  blood_pressure_diastolic: { min: 60, max: 90 },
  oxygen_saturation: { min: 95, max: 100 },
  respiratory_rate: { min: 12, max: 20 },
  pain_level: { min: 0, max: 10 },
};

const getBaseValue = (vitalType: string): number => {
  const range = vitalRanges[vitalType];
  return range ? (range.min + range.max) / 2 : 0;
};

const getVariance = (vitalType: string): number => {
  const range = vitalRanges[vitalType];
  return range ? (range.max - range.min) / 2 : 0;
};

const formatVitalValue = (vitalType: string, value: number): number => {
  if (vitalType === 'temperature') {
    return parseFloat(value.toFixed(1));
  } else if (vitalType === 'pain_level') {
    return Math.round(value);
  } else {
    return Math.round(value);
  }
};

export const generateMockVitalsData = () => {
  const trendOptions = ['stable', 'improving', 'worsening', 'erratic'];
  const vitalTypes = [
    'temperature',
    'heart_rate',
    'blood_pressure_systolic',
    'blood_pressure_diastolic',
    'oxygen_saturation',
    'respiratory_rate',
    'pain_level',
  ];

  const vitalType = vitalTypes[Math.floor(Math.random() * vitalTypes.length)];
  const trend = trendOptions[Math.floor(Math.random() * trendOptions.length)];

  switch (trend) {
    case 'stable': {
      const baseValue = getBaseValue(vitalType);
      const variance = getVariance(vitalType) * 0.2; // Lower variance for stable
      const value = baseValue + (Math.random() * variance * 2 - variance);
      return formatVitalValue(vitalType, value);
    }
    case 'improving': {
      const baseValue = getBaseValue(vitalType);
      const variance = getVariance(vitalType) * 0.4;
      const value = baseValue - Math.abs(Math.random() * variance);
      return formatVitalValue(vitalType, value);
    }
    case 'worsening': {
      const baseValue = getBaseValue(vitalType);
      const variance = getVariance(vitalType) * 0.7;
      const value = baseValue + Math.abs(Math.random() * variance);
      return formatVitalValue(vitalType, value);
    }
    case 'erratic': {
      const baseValue = getBaseValue(vitalType);
      const variance = getVariance(vitalType);
      const value = baseValue + (Math.random() * variance * 2 - variance);
      return formatVitalValue(vitalType, value);
    }
    default:
      return formatVitalValue(vitalType, getBaseValue(vitalType));
  }
};
