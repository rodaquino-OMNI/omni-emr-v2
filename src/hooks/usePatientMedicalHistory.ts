
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MedicalHistoryEntry, Allergy, Diagnosis } from '@/types/patientTypes';
import { toast } from 'sonner';

export const usePatientMedicalHistory = (patientId?: string) => {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryEntry[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all medical history data
  const fetchMedicalHistory = useCallback(async () => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch medical history entries
      const { data: historyData, error: historyError } = await supabase
        .from('medical_history_entries')
        .select('*')
        .eq('patient_id', patientId)
        .order('entry_date', { ascending: false });

      if (historyError) throw historyError;
      
      setMedicalHistory(historyData as MedicalHistoryEntry[]);

      // Fetch allergies
      const { data: allergyData, error: allergyError } = await supabase
        .from('allergies')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (allergyError) throw allergyError;
      
      setAllergies(allergyData as Allergy[]);

      // Fetch diagnoses
      const { data: diagnosisData, error: diagnosisError } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('patient_id', patientId)
        .order('diagnosed_date', { ascending: false });

      if (diagnosisError) throw diagnosisError;
      
      setDiagnoses(diagnosisData as Diagnosis[]);
      
    } catch (err) {
      console.error('Error fetching medical history:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching medical history');
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  // Add a new medical history entry
  const addMedicalHistoryEntry = useCallback(async (entry: Omit<MedicalHistoryEntry, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('medical_history_entries')
        .insert([entry])
        .select()
        .single();

      if (error) throw error;
      
      setMedicalHistory(prev => [data as MedicalHistoryEntry, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding medical history entry:', err);
      throw err;
    }
  }, []);

  // Add a new allergy
  const addAllergy = useCallback(async (allergy: Omit<Allergy, 'id' | 'created_at' | 'is_active'>) => {
    try {
      const { data, error } = await supabase
        .from('allergies')
        .insert([{ ...allergy, is_active: true }])
        .select()
        .single();

      if (error) throw error;
      
      setAllergies(prev => [data as Allergy, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding allergy:', err);
      throw err;
    }
  }, []);

  // Add a new diagnosis
  const addDiagnosis = useCallback(async (diagnosis: Omit<Diagnosis, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('diagnoses')
        .insert([diagnosis])
        .select()
        .single();

      if (error) throw error;
      
      setDiagnoses(prev => [data as Diagnosis, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding diagnosis:', err);
      throw err;
    }
  }, []);

  // Effect to fetch medical history data on mount or when patientId changes
  useEffect(() => {
    fetchMedicalHistory();
  }, [fetchMedicalHistory]);

  return {
    medicalHistory,
    allergies,
    diagnoses,
    isLoading,
    error,
    fetchMedicalHistory,
    addMedicalHistoryEntry,
    addAllergy,
    addDiagnosis
  };
};
