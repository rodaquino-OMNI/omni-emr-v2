
import { VitalType, VitalChartConfig } from "../types/vitalsTypes";
import { TranslationKey } from "@/i18n/translations";

export const getVitalChartConfig = (type: VitalType, t: (key: TranslationKey | string) => string): VitalChartConfig => {
  switch (type) {
    case 'heartRate':
      return {
        label: t('heartRate' as TranslationKey),
        unit: t('bpm' as TranslationKey),
        color: '#f43f5e',
        domain: [40, 160],
        normalRange: [60, 100],
        criticalLow: 50,
        criticalHigh: 120
      };
    case 'bloodPressure':
      return {
        label: t('bloodPressure' as TranslationKey),
        unit: t('mmHg' as TranslationKey),
        color: '#0ea5e9',
        colorSecondary: '#6366f1',
        domain: [40, 200],
        normalSystolic: [90, 140],
        normalDiastolic: [60, 90],
        criticalSystolic: { low: 80, high: 180 },
        criticalDiastolic: { low: 50, high: 120 }
      };
    case 'temperature':
      return {
        label: t('temperature' as TranslationKey),
        unit: '°C',
        color: '#f97316',
        domain: [35, 40],
        normalRange: [36.5, 37.5],
        criticalLow: 35,
        criticalHigh: 39
      };
    case 'oxygenSaturation':
      return {
        label: t('oxygenSaturation' as TranslationKey),
        unit: '%',
        color: '#10b981',
        domain: [80, 100],
        normalRange: [95, 100],
        criticalLow: 90,
        criticalHigh: 100
      };
    case 'respiratoryRate':
      return {
        label: t('respiratoryRate' as TranslationKey),
        unit: t('breathsPerMinute' as TranslationKey),
        color: '#9333ea',
        domain: [8, 40],
        normalRange: [12, 20],
        criticalLow: 8,
        criticalHigh: 30
      };
    case 'bloodGlucose':
      return {
        label: t('bloodGlucose' as TranslationKey),
        unit: 'mg/dL',
        color: '#6366f1',
        domain: [40, 300],
        normalRange: [70, 140],
        criticalLow: 60,
        criticalHigh: 200
      };
    case 'pain':
      return {
        label: t('painLevel' as TranslationKey),
        unit: '',
        color: '#ef4444',
        domain: [0, 10],
        normalRange: [0, 3],
        criticalHigh: 7
      };
    default:
      return {
        label: '',
        unit: '',
        color: '#9ca3af',
        domain: [0, 100],
        normalRange: [0, 100]
      };
  }
};
