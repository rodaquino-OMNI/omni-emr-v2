
import { useState, useEffect } from 'react';
import { VitalSigns } from '@/types/patient';

export type AbnormalVital = {
  name: string;
  value: number | string;
  normalRange: string;
  severity: 'low' | 'medium' | 'high';
};

export const useVitalSignsAbnormalities = (vitals: VitalSigns | null) => {
  const [abnormalFindings, setAbnormalFindings] = useState<AbnormalVital[]>([]);
  
  useEffect(() => {
    if (!vitals) {
      setAbnormalFindings([]);
      return;
    }
    
    const newAbnormalFindings: AbnormalVital[] = [];
    
    // Check temperature
    if (vitals.temperature) {
      if (vitals.temperature > 38.5) {
        newAbnormalFindings.push({
          name: 'Temperature',
          value: `${vitals.temperature}°C`,
          normalRange: '36.5-37.5°C',
          severity: vitals.temperature > 39.5 ? 'high' : 'medium',
        });
      } else if (vitals.temperature < 36) {
        newAbnormalFindings.push({
          name: 'Temperature',
          value: `${vitals.temperature}°C`,
          normalRange: '36.5-37.5°C',
          severity: vitals.temperature < 35 ? 'high' : 'medium',
        });
      }
    }
    
    // Check heart rate
    if (vitals.heart_rate) {
      if (vitals.heart_rate > 100) {
        newAbnormalFindings.push({
          name: 'Heart Rate',
          value: `${vitals.heart_rate} bpm`,
          normalRange: '60-100 bpm',
          severity: vitals.heart_rate > 120 ? 'high' : 'medium',
        });
      } else if (vitals.heart_rate < 60) {
        newAbnormalFindings.push({
          name: 'Heart Rate',
          value: `${vitals.heart_rate} bpm`,
          normalRange: '60-100 bpm',
          severity: vitals.heart_rate < 50 ? 'high' : 'medium',
        });
      }
    }
    
    // Check respiratory rate
    if (vitals.respiratory_rate) {
      if (vitals.respiratory_rate > 20) {
        newAbnormalFindings.push({
          name: 'Respiratory Rate',
          value: `${vitals.respiratory_rate} bpm`,
          normalRange: '12-20 bpm',
          severity: vitals.respiratory_rate > 24 ? 'high' : 'medium',
        });
      } else if (vitals.respiratory_rate < 12) {
        newAbnormalFindings.push({
          name: 'Respiratory Rate',
          value: `${vitals.respiratory_rate} bpm`,
          normalRange: '12-20 bpm',
          severity: vitals.respiratory_rate < 10 ? 'high' : 'low',
        });
      }
    }
    
    // Check blood pressure
    if (vitals.blood_pressure_systolic && vitals.blood_pressure_diastolic) {
      const systolic = vitals.blood_pressure_systolic;
      const diastolic = vitals.blood_pressure_diastolic;
      
      if (systolic > 140 || diastolic > 90) {
        newAbnormalFindings.push({
          name: 'Blood Pressure',
          value: `${systolic}/${diastolic} mmHg`,
          normalRange: '90-140/60-90 mmHg',
          severity: (systolic > 160 || diastolic > 100) ? 'high' : 'medium',
        });
      } else if (systolic < 90 || diastolic < 60) {
        newAbnormalFindings.push({
          name: 'Blood Pressure',
          value: `${systolic}/${diastolic} mmHg`,
          normalRange: '90-140/60-90 mmHg',
          severity: (systolic < 80 || diastolic < 50) ? 'high' : 'medium',
        });
      }
    }
    
    // Check oxygen saturation
    if (vitals.oxygen_saturation) {
      if (vitals.oxygen_saturation < 95) {
        newAbnormalFindings.push({
          name: 'Oxygen Saturation',
          value: `${vitals.oxygen_saturation}%`,
          normalRange: '95-100%',
          severity: vitals.oxygen_saturation < 90 ? 'high' : 'medium',
        });
      }
    }
    
    // Check pain level
    if (vitals.pain_level && vitals.pain_level > 4) {
      newAbnormalFindings.push({
        name: 'Pain Level',
        value: vitals.pain_level.toString(),
        normalRange: '0-3',
        severity: vitals.pain_level > 7 ? 'high' : 'medium',
      });
    }
    
    setAbnormalFindings(newAbnormalFindings);
  }, [vitals]);
  
  return {
    abnormalFindings,
    hasAbnormalFindings: abnormalFindings.length > 0,
    hasCriticalFindings: abnormalFindings.some(finding => finding.severity === 'high')
  };
};
