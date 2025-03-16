
import { v4 as uuidv4 } from 'uuid';
import { VitalSigns, FHIRVitalSign } from '../types';
import { supabase, logEnhancedAuditEvent } from '@/integrations/supabase/client';
import { vitalSignsToFHIR, fhirToVitalSigns } from '@/utils/fhir/FHIRAdapter';

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
    
    // Store vital signs in the traditional format
    const { error } = await supabase
      .from('vital_signs')
      .insert({
        id,
        patient_id: patientId,
        heart_rate: vitalSigns.heartRate,
        systolic_bp: vitalSigns.bloodPressure ? parseInt(vitalSigns.bloodPressure.split('/')[0], 10) : null,
        diastolic_bp: vitalSigns.bloodPressure ? parseInt(vitalSigns.bloodPressure.split('/')[1], 10) : null,
        temperature: vitalSigns.temperature,
        respiratory_rate: vitalSigns.respiratoryRate,
        oxygen_saturation: vitalSigns.oxygenSaturation,
        pain_level: vitalSigns.painLevel,
        recorded_by: recordedById,
        recorder_name: recordedByName,
        timestamp,
        notes: vitalSigns.notes
      });

    if (error) {
      console.error('Error recording vital signs:', error);
      return false;
    }
    
    // Also store as FHIR-compliant observations
    const fhirVitalSigns = vitalSignsToFHIR(vitalSigns, patientId);
    
    // Insert each observation
    const fhirPromises = fhirVitalSigns.map(async (observation) => {
      const { error: obsError } = await supabase
        .from('observations')
        .insert({
          id: uuidv4(),
          status: observation.status,
          code: observation.code,
          subject_id: patientId,
          effective_date_time: observation.effectiveDateTime,
          value_quantity: observation.valueQuantity,
          component: observation.component,
          performer_id: recordedById,
          note: vitalSigns.notes ? [{text: vitalSigns.notes}] : undefined
        });
        
      if (obsError) {
        console.error('Error recording FHIR observation:', obsError);
      }
    });
    
    await Promise.all(fhirPromises);
    
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
 * Get FHIR-compliant vital sign observations for a patient
 */
export const getFHIRVitalSigns = async (patientId: string): Promise<FHIRVitalSign[]> => {
  try {
    // Query observations table for vital signs
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
        '72514-3'  // Pain severity
      ])
      .order('effective_date_time', { ascending: false });
      
    if (error) {
      console.error('Error fetching FHIR vital signs:', error);
      return [];
    }
    
    // Transform the database records into proper FHIR Observation resources
    const fhirObservations: FHIRVitalSign[] = data.map(record => ({
      resourceType: 'Observation',
      id: record.id,
      status: record.status,
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
