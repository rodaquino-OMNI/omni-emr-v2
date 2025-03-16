
/**
 * FHIR Adapter to ensure compatibility with the improved FHIR-compliant database
 * This provides methods for converting between app data models and FHIR resources
 */

import { VitalSigns, FHIRVitalSign } from '@/services/visitNotes/types';

/**
 * Convert app VitalSigns model to FHIR Observation resources
 */
export const vitalSignsToFHIR = (vitalSigns: VitalSigns, patientId: string): FHIRVitalSign[] => {
  const fhirVitalSigns: FHIRVitalSign[] = [];
  const timestamp = vitalSigns.recordedAt || new Date().toISOString();
  
  // Convert heart rate to FHIR
  if (vitalSigns.heartRate !== undefined) {
    fhirVitalSigns.push({
      resourceType: 'Observation',
      id: `heart-rate-${Date.now()}`,
      status: 'final',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '8867-4',
          display: 'Heart rate'
        }],
        text: 'Heart rate'
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: timestamp,
      valueQuantity: {
        value: vitalSigns.heartRate,
        unit: 'beats/min',
        system: 'http://unitsofmeasure.org',
        code: '/min'
      }
    });
  }
  
  // Convert blood pressure to FHIR
  if (vitalSigns.bloodPressure) {
    const bpParts = vitalSigns.bloodPressure.split('/');
    if (bpParts.length === 2) {
      const systolic = parseInt(bpParts[0], 10);
      const diastolic = parseInt(bpParts[1], 10);
      
      fhirVitalSigns.push({
        resourceType: 'Observation',
        id: `blood-pressure-${Date.now()}`,
        status: 'final',
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '85354-9',
            display: 'Blood pressure panel'
          }],
          text: 'Blood pressure'
        },
        subject: {
          reference: `Patient/${patientId}`
        },
        effectiveDateTime: timestamp,
        component: [
          {
            code: {
              coding: [{
                system: 'http://loinc.org',
                code: '8480-6',
                display: 'Systolic blood pressure'
              }]
            },
            valueQuantity: {
              value: systolic,
              unit: 'mmHg',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]'
            }
          },
          {
            code: {
              coding: [{
                system: 'http://loinc.org',
                code: '8462-4',
                display: 'Diastolic blood pressure'
              }]
            },
            valueQuantity: {
              value: diastolic,
              unit: 'mmHg',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]'
            }
          }
        ]
      });
    }
  }
  
  // Convert temperature to FHIR
  if (vitalSigns.temperature !== undefined) {
    fhirVitalSigns.push({
      resourceType: 'Observation',
      id: `temperature-${Date.now()}`,
      status: 'final',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '8310-5',
          display: 'Body temperature'
        }],
        text: 'Temperature'
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: timestamp,
      valueQuantity: {
        value: vitalSigns.temperature,
        unit: '°C',
        system: 'http://unitsofmeasure.org',
        code: 'Cel'
      }
    });
  }
  
  // Convert respiratory rate to FHIR
  if (vitalSigns.respiratoryRate !== undefined) {
    fhirVitalSigns.push({
      resourceType: 'Observation',
      id: `respiratory-rate-${Date.now()}`,
      status: 'final',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '9279-1',
          display: 'Respiratory rate'
        }],
        text: 'Respiratory rate'
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: timestamp,
      valueQuantity: {
        value: vitalSigns.respiratoryRate,
        unit: 'breaths/min',
        system: 'http://unitsofmeasure.org',
        code: '/min'
      }
    });
  }
  
  // Convert oxygen saturation to FHIR
  if (vitalSigns.oxygenSaturation !== undefined) {
    fhirVitalSigns.push({
      resourceType: 'Observation',
      id: `oxygen-saturation-${Date.now()}`,
      status: 'final',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '2708-6',
          display: 'Oxygen saturation'
        }],
        text: 'Oxygen saturation'
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: timestamp,
      valueQuantity: {
        value: vitalSigns.oxygenSaturation,
        unit: '%',
        system: 'http://unitsofmeasure.org',
        code: '%'
      }
    });
  }
  
  // Convert pain level to FHIR
  if (vitalSigns.painLevel !== undefined) {
    fhirVitalSigns.push({
      resourceType: 'Observation',
      id: `pain-level-${Date.now()}`,
      status: 'final',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '72514-3',
          display: 'Pain severity score'
        }],
        text: 'Pain level'
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: timestamp,
      valueQuantity: {
        value: vitalSigns.painLevel,
        unit: '{score}',
        system: 'http://unitsofmeasure.org',
        code: '{score}'
      }
    });
  }
  
  return fhirVitalSigns;
};

/**
 * Convert FHIR Observation resources to app VitalSigns model
 */
export const fhirToVitalSigns = (fhirObservations: FHIRVitalSign[]): VitalSigns => {
  const vitalSigns: VitalSigns = {};
  
  // Extract recorded timestamp from most recent observation
  const mostRecentObservation = [...fhirObservations].sort((a, b) => 
    new Date(b.effectiveDateTime).getTime() - new Date(a.effectiveDateTime).getTime()
  )[0];
  
  if (mostRecentObservation) {
    vitalSigns.recordedAt = mostRecentObservation.effectiveDateTime;
  }
  
  // Extract individual vital signs from FHIR observations
  fhirObservations.forEach(obs => {
    // Get the LOINC code from the first coding
    const loincCode = obs.code.coding?.[0]?.code;
    
    // Extract value based on the LOINC code
    if (loincCode === '8867-4') {
      // Heart rate
      vitalSigns.heartRate = obs.valueQuantity?.value;
    } else if (loincCode === '85354-9') {
      // Blood pressure panel
      const systolic = obs.component?.find(
        c => c.code.coding?.[0]?.code === '8480-6'
      )?.valueQuantity?.value;
      
      const diastolic = obs.component?.find(
        c => c.code.coding?.[0]?.code === '8462-4'
      )?.valueQuantity?.value;
      
      if (systolic && diastolic) {
        vitalSigns.bloodPressure = `${systolic}/${diastolic}`;
      }
    } else if (loincCode === '8310-5') {
      // Temperature
      vitalSigns.temperature = obs.valueQuantity?.value;
    } else if (loincCode === '9279-1') {
      // Respiratory rate
      vitalSigns.respiratoryRate = obs.valueQuantity?.value;
    } else if (loincCode === '2708-6') {
      // Oxygen saturation
      vitalSigns.oxygenSaturation = obs.valueQuantity?.value;
    } else if (loincCode === '72514-3') {
      // Pain level
      vitalSigns.painLevel = obs.valueQuantity?.value;
    }
  });
  
  return vitalSigns;
};
