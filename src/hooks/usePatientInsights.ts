
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Patient, VitalSigns, MedicalHistoryEntry, Allergy, Diagnosis, Prescription } from '@/types/patientTypes';

export interface PatientInsight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: 'vitals' | 'medication' | 'diagnosis' | 'allergy' | 'general';
  timestamp: string;
  relatedData?: any;
}

export const usePatientInsights = (patientId?: string) => {
  const [insights, setInsights] = useState<PatientInsight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }

    const generateInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all the patient data we need for generating insights
        const [
          patientResult,
          vitalsResult,
          diagnosesResult,
          allergiesResult,
          prescriptionsResult,
          prescriptionItemsResult
        ] = await Promise.all([
          // Patient basic info
          supabase.from('patients').select('*').eq('id', patientId).single(),
          
          // Recent vital signs
          supabase.from('vital_signs').select('*').eq('patient_id', patientId).order('timestamp', { ascending: false }).limit(10),
          
          // Diagnoses
          supabase.from('diagnoses').select('*').eq('patient_id', patientId),
          
          // Allergies
          supabase.from('allergies').select('*').eq('patient_id', patientId).eq('is_active', true),
          
          // Prescriptions
          supabase.from('prescriptions').select('*').eq('patient_id', patientId).order('date', { ascending: false }).limit(5),
          
          // Prescription items (will be filtered later)
          supabase.from('prescription_items').select('*')
        ]);

        // Handle errors
        if (patientResult.error) throw patientResult.error;
        if (vitalsResult.error) throw vitalsResult.error;
        if (diagnosesResult.error) throw diagnosesResult.error;
        if (allergiesResult.error) throw allergiesResult.error;
        if (prescriptionsResult.error) throw prescriptionsResult.error;
        if (prescriptionItemsResult.error) throw prescriptionItemsResult.error;

        const patient = patientResult.data as Patient;
        const vitals = vitalsResult.data as VitalSigns[];
        const diagnoses = diagnosesResult.data as Diagnosis[];
        const allergies = allergiesResult.data as Allergy[];
        const prescriptions = prescriptionsResult.data as Prescription[];
        
        // Filter prescription items to only those belonging to fetched prescriptions
        const prescriptionIds = prescriptions.map(p => p.id);
        const prescriptionItems = prescriptionItemsResult.data.filter(
          item => prescriptionIds.includes(item.prescription_id)
        );

        // Generate insights based on the data
        const generatedInsights: PatientInsight[] = [];

        // Example insights based on vital signs
        if (vitals.length > 0) {
          const latestVitals = vitals[0];
          
          // High blood pressure insight
          if (latestVitals.systolic_bp && latestVitals.systolic_bp > 140) {
            generatedInsights.push({
              id: `bp-high-${Date.now()}`,
              title: 'Elevated Blood Pressure',
              description: `Patient's last recorded blood pressure (${latestVitals.systolic_bp}/${latestVitals.diastolic_bp || 'N/A'}) is above the normal range.`,
              severity: latestVitals.systolic_bp > 180 ? 'high' : 'medium',
              category: 'vitals',
              timestamp: new Date().toISOString(),
              relatedData: latestVitals
            });
          }
          
          // Low oxygen saturation insight
          if (latestVitals.oxygen_saturation && latestVitals.oxygen_saturation < 94) {
            generatedInsights.push({
              id: `o2-low-${Date.now()}`,
              title: 'Low Oxygen Saturation',
              description: `Patient's oxygen saturation (${latestVitals.oxygen_saturation}%) is below the normal range.`,
              severity: latestVitals.oxygen_saturation < 90 ? 'high' : 'medium',
              category: 'vitals',
              timestamp: new Date().toISOString(),
              relatedData: latestVitals
            });
          }
        }

        // Example insight based on diagnoses and medications
        const diabetesDiagnosis = diagnoses.find(d => 
          d.diagnosis.toLowerCase().includes('diabetes') || 
          (d.icd_code && d.icd_code.startsWith('E11'))
        );
        
        if (diabetesDiagnosis) {
          // Check if patient is on diabetes medication
          const diabetesMeds = prescriptionItems.filter(item => 
            ['insulin', 'metformin', 'glipizide', 'glyburide', 'glimepiride'].some(med => 
              item.name.toLowerCase().includes(med)
            )
          );
          
          if (diabetesMeds.length === 0) {
            generatedInsights.push({
              id: `diabetes-no-meds-${Date.now()}`,
              title: 'Diabetes Management Alert',
              description: 'Patient has diabetes diagnosis but no diabetes medications are currently prescribed.',
              severity: 'medium',
              category: 'medication',
              timestamp: new Date().toISOString(),
              relatedData: diabetesDiagnosis
            });
          }
        }

        // Example insight based on allergies and medications
        if (allergies.length > 0 && prescriptionItems.length > 0) {
          for (const allergy of allergies) {
            const allergen = allergy.allergen.toLowerCase();
            
            for (const medication of prescriptionItems) {
              if (medication.name.toLowerCase().includes(allergen)) {
                generatedInsights.push({
                  id: `allergy-med-conflict-${Date.now()}-${medication.id}`,
                  title: 'Potential Medication-Allergy Interaction',
                  description: `Patient is allergic to ${allergy.allergen} but is prescribed ${medication.name}.`,
                  severity: 'high',
                  category: 'allergy',
                  timestamp: new Date().toISOString(),
                  relatedData: { allergy, medication }
                });
              }
            }
          }
        }

        // Age-based insights
        if (patient.date_of_birth) {
          const birthDate = new Date(patient.date_of_birth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear() - 
                     (today.getMonth() < birthDate.getMonth() || 
                     (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
          
          if (age >= 65 && vitals.length > 0) {
            // Fall risk assessment for elderly patients
            generatedInsights.push({
              id: `elderly-fall-risk-${Date.now()}`,
              title: 'Fall Risk Assessment Recommended',
              description: `Patient is ${age} years old and should receive regular fall risk assessments.`,
              severity: 'low',
              category: 'general',
              timestamp: new Date().toISOString(),
              relatedData: { age }
            });
          }
        }

        setInsights(generatedInsights);
      } catch (err) {
        console.error('Error generating patient insights:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while generating patient insights');
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [patientId]);

  return { insights, isLoading, error };
};
