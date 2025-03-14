
import { VitalType, TimeRangeType, VitalDataPoint } from "../types/vitalsTypes";

export const generateMockVitalsData = (type: VitalType, patientId: string, timeRange: TimeRangeType): VitalDataPoint[] => {
  const today = new Date();
  const data: VitalDataPoint[] = [];
  
  let dataPoints = 7;
  let intervalHours = 24;
  
  switch(timeRange) {
    case '24h':
      dataPoints = 8;
      intervalHours = 3;
      break;
    case '3d':
      dataPoints = 9;
      intervalHours = 8;
      break;
    case '7d':
      dataPoints = 7;
      intervalHours = 24;
      break;
    case '30d':
      dataPoints = 10;
      intervalHours = 72;
      break;
  }
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setHours(date.getHours() - (i * intervalHours));
    
    let value;
    let isAbnormal = false;
    
    const patientSeed = parseInt(patientId) || 1;
    const timeSeed = i + 1;
    const randomFactor = Math.sin(patientSeed * timeSeed) * 10;
    
    const abnormalProbability = Math.random() < 0.15;
    
    switch (type) {
      case 'heartRate':
        value = Math.floor(80 + randomFactor);
        
        if (abnormalProbability) {
          value = Math.random() < 0.5 ? 
            Math.floor(40 + Math.random() * 15) : 
            Math.floor(110 + Math.random() * 40);
          isAbnormal = true;
        }
        break;
        
      case 'bloodPressure':
        const baselineSystolic = 120 + randomFactor;
        const baselineDiastolic = 80 + (randomFactor * 0.5);
        
        let systolic = Math.floor(baselineSystolic);
        let diastolic = Math.floor(baselineDiastolic);
        
        if (abnormalProbability) {
          if (Math.random() < 0.5) {
            systolic = Math.floor(80 + Math.random() * 10);
            diastolic = Math.floor(50 + Math.random() * 10);
          } else {
            systolic = Math.floor(150 + Math.random() * 30);
            diastolic = Math.floor(95 + Math.random() * 15);
          }
          isAbnormal = true;
        }
        
        value = { systolic, diastolic, isAbnormal };
        break;
        
      case 'temperature':
        value = (37 + randomFactor * 0.05).toFixed(1);
        
        if (abnormalProbability) {
          value = Math.random() < 0.5 ?
            (35.5 + Math.random() * 0.5).toFixed(1) :
            (38.5 + Math.random() * 1.5).toFixed(1);
          isAbnormal = true;
        }
        break;
        
      case 'oxygenSaturation':
        value = Math.min(100, Math.floor(97 + randomFactor * 0.3));
        
        if (abnormalProbability) {
          value = Math.floor(85 + Math.random() * 7);
          isAbnormal = true;
        }
        break;
        
      case 'respiratoryRate':
        value = Math.floor(16 + randomFactor * 0.4);
        
        if (abnormalProbability) {
          value = Math.random() < 0.5 ?
            Math.floor(8 + Math.random() * 3) :
            Math.floor(24 + Math.random() * 12);
          isAbnormal = true;
        }
        break;
        
      case 'bloodGlucose':
        value = Math.floor(85 + randomFactor * 1.5);
        
        if (abnormalProbability) {
          value = Math.random() < 0.5 ?
            Math.floor(40 + Math.random() * 25) :
            Math.floor(180 + Math.random() * 120);
          isAbnormal = true;
        }
        break;
        
      case 'pain':
        value = Math.floor(2 + randomFactor * 0.3);
        
        if (abnormalProbability) {
          value = Math.floor(7 + Math.random() * 3);
          isAbnormal = true;
        }
        
        value = Math.max(0, Math.min(10, value));
        break;
        
      default:
        value = 0;
    }
    
    const formattedDate = timeRange === '24h' ? 
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
      date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + 
      (timeRange === '3d' ? ' ' + date.toLocaleTimeString([], { hour: '2-digit' }) : '');
      
    data.push({
      date: formattedDate,
      timestamp: date.toISOString(),
      value,
      isAbnormal
    });
  }
  
  return data;
};
