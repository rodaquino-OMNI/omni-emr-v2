
import { PatientStatus } from '@/types/patientTypes';
import { Languages } from '@/types/auth';

// Function to get status color class based on patient status
export const getStatusColorClass = (status: PatientStatus): string => {
  const colorClasses = {
    'stable': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'improving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'discharged': 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400',
    'hospital': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'home': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
  };
  
  return colorClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400';
};

// Function to get translated status label based on patient status and language
export const getStatusLabel = (status: PatientStatus, language: Languages): string => {
  const statusLabels = {
    en: {
      'stable': 'Stable',
      'improving': 'Improving',
      'critical': 'Critical',
      'discharged': 'Discharged',
      'hospital': 'In Hospital',
      'home': 'At Home'
    },
    pt: {
      'stable': 'Estável',
      'improving': 'Melhorando',
      'critical': 'Crítico',
      'discharged': 'Alta',
      'hospital': 'No Hospital',
      'home': 'Em Casa'
    }
  };
  
  return statusLabels[language][status] || status;
};

// Function to determine patient status from various data points
export const determinePatientStatus = (
  currentStatus?: string | null,
  vitalSigns?: any[],
  admissionInfo?: any
): PatientStatus => {
  // If status is explicitly set, use that
  if (currentStatus) {
    if (
      currentStatus === 'stable' ||
      currentStatus === 'critical' ||
      currentStatus === 'improving' ||
      currentStatus === 'discharged' ||
      currentStatus === 'hospital' ||
      currentStatus === 'home'
    ) {
      return currentStatus;
    }
  }
  
  // Check if patient is discharged
  if (admissionInfo?.discharged) {
    return 'discharged';
  }
  
  // Check if patient is in hospital
  if (admissionInfo?.isAdmitted) {
    // Check vitals for critical status
    if (vitalSigns && vitalSigns.length > 0) {
      const latestVitals = vitalSigns[0];
      
      // Example logic for determining if patient is critical based on vitals
      if (
        (latestVitals.systolic_bp && (latestVitals.systolic_bp > 180 || latestVitals.systolic_bp < 90)) ||
        (latestVitals.diastolic_bp && (latestVitals.diastolic_bp > 120 || latestVitals.diastolic_bp < 60)) ||
        (latestVitals.heart_rate && (latestVitals.heart_rate > 120 || latestVitals.heart_rate < 50)) ||
        (latestVitals.respiratory_rate && (latestVitals.respiratory_rate > 30 || latestVitals.respiratory_rate < 8)) ||
        (latestVitals.oxygen_saturation && latestVitals.oxygen_saturation < 90)
      ) {
        return 'critical';
      }
      
      // Compare with previous vitals to determine if improving
      if (vitalSigns.length > 1) {
        const previousVitals = vitalSigns[1];
        
        // Example logic for improvement - simplistic for demonstration
        if (
          (latestVitals.systolic_bp && previousVitals.systolic_bp && Math.abs(latestVitals.systolic_bp - 120) < Math.abs(previousVitals.systolic_bp - 120)) ||
          (latestVitals.oxygen_saturation && previousVitals.oxygen_saturation && latestVitals.oxygen_saturation > previousVitals.oxygen_saturation)
        ) {
          return 'improving';
        }
      }
    }
    
    return 'hospital';
  }
  
  // Default for outpatients
  return 'home';
};
