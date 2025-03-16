
import { supabase } from '@/integrations/supabase/client';
import { MedicalRecord, RecordFilters } from '@/types/medicalRecordTypes';

/**
 * Service for handling medical records
 */
export const recordService = {
  /**
   * Get all medical records
   */
  getAllRecords: async (filters?: RecordFilters): Promise<MedicalRecord[]> => {
    try {
      let query = supabase
        .from('medical_records')
        .select('*');
      
      // Apply filters if provided
      if (filters) {
        if (filters.searchTerm) {
          query = query.or(`title.ilike.%${filters.searchTerm}%,provider.ilike.%${filters.searchTerm}%`);
        }
        
        if (filters.typeFilter && filters.typeFilter !== 'all') {
          query = query.eq('type', filters.typeFilter);
        }
        
        if (filters.statusFilter && filters.statusFilter !== 'all') {
          query = query.eq('status', filters.statusFilter);
        }
        
        if (filters.dateRange?.from) {
          query = query.gte('date', filters.dateRange.from.toISOString());
        }
        
        if (filters.dateRange?.to) {
          query = query.lte('date', filters.dateRange.to.toISOString());
        }
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      
      return data as MedicalRecord[];
    } catch (error) {
      console.error('Error fetching records:', error);
      return [];
    }
  },
  
  /**
   * Get a record by ID
   */
  getRecordById: async (id: string): Promise<MedicalRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as MedicalRecord;
    } catch (error) {
      console.error('Error fetching record:', error);
      return null;
    }
  },
  
  /**
   * Get records for a specific patient
   */
  getPatientRecords: async (patientId: string): Promise<MedicalRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patientId', patientId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data as MedicalRecord[];
    } catch (error) {
      console.error('Error fetching patient records:', error);
      return [];
    }
  },
  
  /**
   * Create a new medical record
   */
  createRecord: async (record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert([record])
        .select()
        .single();
      
      if (error) throw error;
      
      return data as MedicalRecord;
    } catch (error) {
      console.error('Error creating record:', error);
      return null;
    }
  },
  
  /**
   * Update an existing medical record
   */
  updateRecord: async (id: string, updates: Partial<MedicalRecord>): Promise<MedicalRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as MedicalRecord;
    } catch (error) {
      console.error('Error updating record:', error);
      return null;
    }
  },
  
  /**
   * Delete a medical record
   */
  deleteRecord: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting record:', error);
      return false;
    }
  }
};
