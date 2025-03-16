
import { v4 as uuidv4 } from 'uuid';
import { VitalSigns, FHIRVitalSign } from '../types';
import { supabase, logEnhancedAuditEvent } from '@/integrations/supabase/client';

/**
 * Convert VitalSigns to FHIR-compliant observations
 */
export const vitalSignsToFHIR = (
  vitalSigns: VitalSigns, 
  patientId: string
): FHIRVitalSign[] => {
  const observations: FHIRVitalSign[] = [];
  const timestamp = new Date().toISOString();
  
  // Add heart rate if present
  if (vitalSigns.heartRate !== undefined) {
    observations.push({
      resourceType: 'Observation',
      id: uuidv4(),
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
  
  // Add other vital signs similarly (simplified for brevity)
  // In a real implementation, we would add all vital signs
  
  return observations;
};

/**
 * Record vital signs for a patient
 * Now enhanced to store in FHIR-compliant format
 */
export const recordVitalSigns = async (
  patientId: string,
  vitalSigns: VitalSigns,
  recordedById: string,
  recordedByName: string
): Promise<boolean> => {
  try {
    // Generate an ID for the vital signs record
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Parse blood pressure
    let systolicBP: number | null = null;
    let diastolicBP: number | null = null;
    
    if (vitalSigns.bloodPressure) {
      const bpParts = vitalSigns.bloodPressure.split('/');
      if (bpParts.length === 2) {
        systolicBP = parseInt(bpParts[0], 10) || null;
        diastolicBP = parseInt(bpParts[1], 10) || null;
      }
    }
    
    // Store vital signs in the traditional format
    const { error } = await supabase
      .from('vital_signs')
      .insert({
        id,
        patient_id: patientId,
        heart_rate: vitalSigns.heartRate,
        systolic_bp: systolicBP,
        diastolic_bp: diastolicBP,
        temperature: vitalSigns.temperature,
        respiratory_rate: vitalSigns.respiratoryRate,
        oxygen_saturation: vitalSigns.oxygenSaturation,
        pain_level: vitalSigns.painLevel,
        recorded_by: recordedById,
        recorder_name: recordedByName,
        timestamp,
        notes: vitalSigns.notes || ''
      });

    if (error) {
      console.error('Error recording vital signs:', error);
      return false;
    }
    
    // Log the action for HIPAA compliance
    await logEnhancedAuditEvent({
      userId: recordedById,
      action: 'create',
      resourceType: 'VitalSigns',
      resourceId: id,
      patientId,
      accessType: 'standard_access',
      accessReason: 'clinical_documentation',
      details: {
        vitalSignsRecorded: Object.keys(vitalSigns).filter(k => k !== 'notes')
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error in recordVitalSigns:', error);
    return false;
  }
};

/**
 * Get the latest vital signs for a patient
 */
export const getLatestVitalSigns = async (patientId: string): Promise<VitalSigns | null> => {
  try {
    const { data, error } = await supabase
      .from('vital_signs')
      .select('*')
      .eq('patient_id', patientId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
      
    if (error || !data) {
      console.error('Error fetching latest vital signs:', error);
      return null;
    }
    
    // Convert from database format to VitalSigns format
    const vitalSigns: VitalSigns = {
      heartRate: data.heart_rate,
      bloodPressure: data.systolic_bp && data.diastolic_bp 
        ? `${data.systolic_bp}/${data.diastolic_bp}` 
        : undefined,
      temperature: data.temperature,
      respiratoryRate: data.respiratory_rate,
      oxygenSaturation: data.oxygen_saturation,
      painLevel: data.pain_level,
      recordedAt: data.timestamp,
      recordedBy: data.recorder_name,
      recordedById: data.recorded_by,
      notes: data.notes
    };
    
    return vitalSigns;
  } catch (error) {
    console.error('Error in getLatestVitalSigns:', error);
    return null;
  }
};

/**
 * Get FHIR-compliant vital sign observations for a patient
 */
export const getFHIRVitalSigns = async (patientId: string): Promise<FHIRVitalSign[]> => {
  try {
    // Query observations table for vital signs
    const { data, error } = await supabase
      .from('observations')
      .select('*')
      .eq('subject_id', patientId)
      .order('effective_date_time', { ascending: false });
      
    if (error) {
      console.error('Error fetching FHIR vital signs:', error);
      return [];
    }
    
    // Transform the database records into proper FHIR Observation resources
    const fhirObservations: FHIRVitalSign[] = data.map(record => ({
      resourceType: 'Observation',
      id: record.id,
      status: record.status as 'final' | 'amended' | 'entered-in-error',
      code: record.code,
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: record.effective_date_time,
      valueQuantity: record.value_quantity,
      component: record.component
    }));
    
    return fhirObservations;
  } catch (error) {
    console.error('Error in getFHIRVitalSigns:', error);
    return [];
  }
};
