
import { supabase } from '@/integrations/supabase/client';
import { VitalSigns, FHIRVitalSign } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Records vital signs for a patient
 * Creates both a traditional entry and FHIR-compliant observations
 * @param patientId The patient's ID
 * @param vitalSigns The vital signs to record
 * @param userId The ID of the user recording the vital signs
 * @param userName The name of the user recording the vital signs
 */
export const recordVitalSigns = async (
  patientId: string,
  vitalSigns: VitalSigns,
  userId: string,
  userName: string
): Promise<boolean> => {
  try {
    // First, record in the traditional vital_signs table
    const { error: vitalSignsError } = await supabase
      .from('vital_signs')
      .insert({
        patient_id: patientId,
        heart_rate: vitalSigns.heartRate,
        systolic_bp: vitalSigns.bloodPressure ? parseInt(vitalSigns.bloodPressure.split('/')[0]) : null,
        diastolic_bp: vitalSigns.bloodPressure ? parseInt(vitalSigns.bloodPressure.split('/')[1]) : null,
        temperature: vitalSigns.temperature,
        respiratory_rate: vitalSigns.respiratoryRate,
        oxygen_saturation: vitalSigns.oxygenSaturation,
        pain_level: vitalSigns.painLevel,
        recorded_by: userId,
        recorder_name: userName,
        timestamp: new Date().toISOString(),
        notes: ''
      });

    if (vitalSignsError) {
      console.error('Error recording vital signs:', vitalSignsError);
      return false;
    }

    // Now record as FHIR observations
    if (vitalSigns.heartRate) {
      await createFHIRObservation(
        patientId,
        'heart-rate',
        '8867-4',
        'Heart rate',
        vitalSigns.heartRate,
        'beats/min',
        userId
      );
    }

    if (vitalSigns.bloodPressure) {
      const [systolic, diastolic] = vitalSigns.bloodPressure.split('/').map(Number);
      
      // Blood pressure is a special case - it's a single observation with components
      const { error: bpError } = await supabase.from('observations').insert({
        status: 'final',
        code: {
          coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }],
          text: 'Blood pressure'
        },
        subject_id: patientId,
        effective_date_time: new Date().toISOString(),
        performer_id: userId,
        component: [
          {
            code: {
              coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }]
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
              coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }]
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

      if (bpError) {
        console.error('Error recording blood pressure as FHIR observation:', bpError);
      }
    }

    if (vitalSigns.temperature) {
      await createFHIRObservation(
        patientId,
        'body-temperature',
        '8310-5',
        'Body temperature',
        vitalSigns.temperature,
        '°C',
        userId
      );
    }

    if (vitalSigns.respiratoryRate) {
      await createFHIRObservation(
        patientId,
        'respiratory-rate',
        '9279-1',
        'Respiratory rate',
        vitalSigns.respiratoryRate,
        'breaths/min',
        userId
      );
    }

    if (vitalSigns.oxygenSaturation) {
      await createFHIRObservation(
        patientId,
        'oxygen-saturation',
        '2708-6',
        'Oxygen saturation',
        vitalSigns.oxygenSaturation,
        '%',
        userId
      );
    }

    if (vitalSigns.painLevel) {
      await createFHIRObservation(
        patientId,
        'pain-level',
        '72514-3',
        'Pain severity score',
        vitalSigns.painLevel,
        '{score}',
        userId
      );
    }

    return true;
  } catch (error) {
    console.error('Error in recordVitalSigns:', error);
    return false;
  }
};

/**
 * Helper function to create a FHIR observation
 */
async function createFHIRObservation(
  patientId: string,
  type: string,
  code: string,
  display: string,
  value: number,
  unit: string,
  performerId: string
) {
  const unitSystem = 'http://unitsofmeasure.org';
  let unitCode = unit;
  
  // Map common units to UCUM codes
  if (unit === '°C') unitCode = 'Cel';
  if (unit === 'breaths/min') unitCode = '/min';
  if (unit === 'beats/min') unitCode = '/min';
  
  const { error } = await supabase.from('observations').insert({
    status: 'final',
    code: {
      coding: [{ system: 'http://loinc.org', code, display }],
      text: display
    },
    subject_id: patientId,
    effective_date_time: new Date().toISOString(),
    performer_id: performerId,
    value_quantity: {
      value,
      unit,
      system: unitSystem,
      code: unitCode
    }
  });

  if (error) {
    console.error(`Error recording ${type} as FHIR observation:`, error);
  }
}

/**
 * Get patient vital signs from both legacy and FHIR tables
 * @param patientId The patient's ID
 * @returns The patient's vital signs in FHIR format
 */
export const getFHIRVitalSigns = async (patientId: string): Promise<FHIRVitalSign[]> => {
  try {
    // Get vital signs from the FHIR observations table
    const { data, error } = await supabase
      .from('observations')
      .select('*')
      .eq('subject_id', patientId)
      .in('code->coding->0->code', [
        '8867-4',  // Heart rate
        '85354-9', // Blood pressure panel
        '8310-5',  // Body temperature
        '9279-1',  // Respiratory rate
        '2708-6',  // Oxygen saturation
        '72514-3', // Pain severity
      ])
      .order('effective_date_time', { ascending: false });

    if (error) {
      console.error('Error fetching FHIR vital signs:', error);
      return [];
    }

    // Map the database results to the FHIRVitalSign interface
    return data.map(observation => ({
      resourceType: 'Observation',
      id: observation.id,
      status: observation.status,
      code: observation.code,
      subject: {
        reference: `Patient/${patientId}`,
        type: 'Patient'
      },
      effectiveDateTime: observation.effective_date_time,
      valueQuantity: observation.value_quantity,
      component: observation.component
    }));
  } catch (error) {
    console.error('Error in getFHIRVitalSigns:', error);
    return [];
  }
};

/**
 * Get the latest vital signs from the materialized view
 * @param patientId The patient's ID
 * @returns The latest vital signs for the patient
 */
export const getLatestVitalSigns = async (patientId: string): Promise<VitalSigns | null> => {
  try {
    // Use the optimized materialized view for better performance
    const { data, error } = await supabase
      .from('patient_latest_vitals')
      .select('*')
      .eq('patient_id', patientId)
      .single();

    if (error) {
      console.error('Error fetching latest vital signs:', error);
      return null;
    }

    if (!data) return null;

    return {
      heartRate: data.heart_rate,
      bloodPressure: data.systolic_bp && data.diastolic_bp ? `${data.systolic_bp}/${data.diastolic_bp}` : undefined,
      temperature: data.temperature,
      respiratoryRate: data.respiratory_rate,
      oxygenSaturation: data.oxygen_saturation,
      painLevel: data.pain_level,
      recordedAt: data.timestamp
    };
  } catch (error) {
    console.error('Error in getLatestVitalSigns:', error);
    return null;
  }
};
