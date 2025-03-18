
import { useState, useEffect } from 'react';
import { VitalSigns } from '@/types/patient';

export interface AbnormalVital {
  name: string;
  value: string;
  normalRange: string;
  severity: 'low' | 'medium' | 'high';
}

// Normal ranges for vital signs
const normalRanges = {
  heartRate: { min: 60, max: 100, unit: 'bpm' },
  systolicBP: { min: 90, max: 140, unit: 'mmHg' },
  diastolicBP: { min: 60, max: 90, unit: 'mmHg' },
  temperature: { min: 36.1, max: 37.2, unit: '°C' },
  respiratoryRate: { min: 12, max: 20, unit: 'breaths/min' },
  oxygenSaturation: { min: 95, max: 100, unit: '%' },
  painLevel: { min: 0, max: 3, unit: '/10' }
};

// Critical thresholds
const criticalThresholds = {
  heartRate: { min: 50, max: 120 },
  systolicBP: { min: 80, max: 180 },
  diastolicBP: { min: 50, max: 110 },
  temperature: { min: 35, max: 38.5 },
  respiratoryRate: { min: 8, max: 30 },
  oxygenSaturation: { min: 90, max: 100 },
  painLevel: { min: 0, max: 7 }
};

export const useVitalSignsAbnormalities = (vitals: VitalSigns | null) => {
  const [abnormalFindings, setAbnormalFindings] = useState<AbnormalVital[]>([]);
  const [hasAbnormalFindings, setHasAbnormalFindings] = useState(false);

  useEffect(() => {
    if (!vitals) {
      setAbnormalFindings([]);
      setHasAbnormalFindings(false);
      return;
    }

    const findings: AbnormalVital[] = [];

    // Check heart rate
    if (vitals.heart_rate !== undefined && vitals.heart_rate !== null) {
      if (vitals.heart_rate < normalRanges.heartRate.min || vitals.heart_rate > normalRanges.heartRate.max) {
        const severity = 
          vitals.heart_rate < criticalThresholds.heartRate.min || vitals.heart_rate > criticalThresholds.heartRate.max
            ? 'high'
            : 'medium';
        findings.push({
          name: 'Heart Rate',
          value: `${vitals.heart_rate} ${normalRanges.heartRate.unit}`,
          normalRange: `${normalRanges.heartRate.min}-${normalRanges.heartRate.max} ${normalRanges.heartRate.unit}`,
          severity
        });
      }
    }

    // Check blood pressure
    if (vitals.blood_pressure_systolic && vitals.blood_pressure_diastolic) {
      if (vitals.blood_pressure_systolic < normalRanges.systolicBP.min || 
          vitals.blood_pressure_systolic > normalRanges.systolicBP.max) {
        const severity = 
          vitals.blood_pressure_systolic < criticalThresholds.systolicBP.min || 
          vitals.blood_pressure_systolic > criticalThresholds.systolicBP.max
            ? 'high'
            : 'medium';
        findings.push({
          name: 'Systolic Blood Pressure',
          value: `${vitals.blood_pressure_systolic} ${normalRanges.systolicBP.unit}`,
          normalRange: `${normalRanges.systolicBP.min}-${normalRanges.systolicBP.max} ${normalRanges.systolicBP.unit}`,
          severity
        });
      }

      if (vitals.blood_pressure_diastolic < normalRanges.diastolicBP.min || 
          vitals.blood_pressure_diastolic > normalRanges.diastolicBP.max) {
        const severity = 
          vitals.blood_pressure_diastolic < criticalThresholds.diastolicBP.min || 
          vitals.blood_pressure_diastolic > criticalThresholds.diastolicBP.max
            ? 'high'
            : 'medium';
        findings.push({
          name: 'Diastolic Blood Pressure',
          value: `${vitals.blood_pressure_diastolic} ${normalRanges.diastolicBP.unit}`,
          normalRange: `${normalRanges.diastolicBP.min}-${normalRanges.diastolicBP.max} ${normalRanges.diastolicBP.unit}`,
          severity
        });
      }
    }

    // Check temperature
    if (vitals.temperature !== undefined && vitals.temperature !== null) {
      if (vitals.temperature < normalRanges.temperature.min || vitals.temperature > normalRanges.temperature.max) {
        const severity = 
          vitals.temperature < criticalThresholds.temperature.min || 
          vitals.temperature > criticalThresholds.temperature.max
            ? 'high'
            : 'medium';
        findings.push({
          name: 'Temperature',
          value: `${vitals.temperature} ${normalRanges.temperature.unit}`,
          normalRange: `${normalRanges.temperature.min}-${normalRanges.temperature.max} ${normalRanges.temperature.unit}`,
          severity
        });
      }
    }

    // Check respiratory rate
    if (vitals.respiratory_rate !== undefined && vitals.respiratory_rate !== null) {
      if (vitals.respiratory_rate < normalRanges.respiratoryRate.min || 
          vitals.respiratory_rate > normalRanges.respiratoryRate.max) {
        const severity = 
          vitals.respiratory_rate < criticalThresholds.respiratoryRate.min || 
          vitals.respiratory_rate > criticalThresholds.respiratoryRate.max
            ? 'high'
            : 'medium';
        findings.push({
          name: 'Respiratory Rate',
          value: `${vitals.respiratory_rate} ${normalRanges.respiratoryRate.unit}`,
          normalRange: `${normalRanges.respiratoryRate.min}-${normalRanges.respiratoryRate.max} ${normalRanges.respiratoryRate.unit}`,
          severity
        });
      }
    }

    // Check oxygen saturation
    if (vitals.oxygen_saturation !== undefined && vitals.oxygen_saturation !== null) {
      if (vitals.oxygen_saturation < normalRanges.oxygenSaturation.min) {
        const severity = 
          vitals.oxygen_saturation < criticalThresholds.oxygenSaturation.min
            ? 'high'
            : 'medium';
        findings.push({
          name: 'Oxygen Saturation',
          value: `${vitals.oxygen_saturation} ${normalRanges.oxygenSaturation.unit}`,
          normalRange: `${normalRanges.oxygenSaturation.min}-${normalRanges.oxygenSaturation.max} ${normalRanges.oxygenSaturation.unit}`,
          severity
        });
      }
    }

    // Check pain level
    if (vitals.pain_level !== undefined && vitals.pain_level !== null) {
      if (vitals.pain_level > normalRanges.painLevel.max) {
        const severity = 
          vitals.pain_level > criticalThresholds.painLevel.max
            ? 'high'
            : 'medium';
        findings.push({
          name: 'Pain Level',
          value: `${vitals.pain_level} ${normalRanges.painLevel.unit}`,
          normalRange: `${normalRanges.painLevel.min}-${normalRanges.painLevel.max} ${normalRanges.painLevel.unit}`,
          severity
        });
      }
    }

    setAbnormalFindings(findings);
    setHasAbnormalFindings(findings.length > 0);
  }, [vitals]);

  return { abnormalFindings, hasAbnormalFindings };
};
