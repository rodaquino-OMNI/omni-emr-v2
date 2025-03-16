
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ResourceType = 
  | 'Patient'
  | 'Condition'
  | 'Observation'
  | 'MedicationRequest'
  | 'AllergyIntolerance'
  | 'Immunization'
  | 'FamilyMemberHistory'
  | 'DocumentReference';

// Map FHIR resource names to database table names
const tableMapping: Record<ResourceType, string> = {
  'Patient': 'patients',
  'Condition': 'conditions',
  'Observation': 'observations',
  'MedicationRequest': 'medication_requests',
  'AllergyIntolerance': 'allergy_intolerances',
  'Immunization': 'immunizations',
  'FamilyMemberHistory': 'family_member_histories',
  'DocumentReference': 'document_references'
};

// Map subject/patient ID column names across tables
const patientIdColumnMapping: Record<string, string> = {
  'patients': 'id',
  'conditions': 'subject_id',
  'observations': 'subject_id',
  'medication_requests': 'subject_id',
  'allergy_intolerances': 'patient_id',
  'immunizations': 'patient_id',
  'family_member_histories': 'patient_id',
  'document_references': 'subject_id'
};

// Hook options interface
interface FHIRResourceOptions {
  patientId?: string;
  limit?: number;
  page?: number;
  filter?: Record<string, any>;
}

/**
 * Hook for fetching FHIR resources
 */
export function useFHIRResources<T extends Record<string, any>>(
  resourceType: ResourceType,
  options?: FHIRResourceOptions
) {
  const [resources, setResources] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  
  const tableName = tableMapping[resourceType];
  const patientIdColumn = patientIdColumnMapping[tableName];
  
  // Define fetch function
  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Start building the query
      let query = supabase.from(tableName as any).select('*', { count: 'exact' });
      
      // Apply patient filter if provided
      if (options?.patientId && patientIdColumn) {
        query = query.eq(patientIdColumn, options.patientId);
      }
      
      // Apply additional filters if provided
      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      // Apply pagination if specified
      if (options?.limit) {
        query = query.limit(options.limit);
        
        if (options?.page && options.page > 1) {
          const offset = (options.page - 1) * options.limit;
          query = query.range(offset, offset + options.limit - 1);
        }
      }
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setResources(data as unknown as T[]);
      
      if (count !== null) {
        setTotalCount(count);
        setPageCount(Math.ceil(count / (options?.limit || 1)));
      }
    } catch (err) {
      console.error(`Error fetching ${resourceType} resources:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [
    tableName, 
    patientIdColumn, 
    options?.patientId, 
    options?.limit, 
    options?.page, 
    options?.filter, 
    resourceType
  ]);
  
  // Fetch resources on initial load and when dependencies change
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);
  
  /**
   * Add a new resource
   */
  const addResource = async (resource: Omit<T, 'id'>): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .insert(resource)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      const newResource = data as unknown as T;
      setResources(prev => [...prev, newResource]);
      
      return newResource;
    } catch (err) {
      console.error(`Error adding ${resourceType} resource:`, err);
      return null;
    }
  };
  
  /**
   * Update an existing resource
   */
  const updateResource = async (id: string, updates: Partial<T>): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      const updatedResource = data as unknown as T;
      setResources(prev => 
        prev.map(item => 
          ((item as any).id === id) ? updatedResource : item
        )
      );
      
      return updatedResource;
    } catch (err) {
      console.error(`Error updating ${resourceType} resource:`, err);
      return null;
    }
  };
  
  /**
   * Delete a resource
   */
  const deleteResource = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setResources(prev => prev.filter(item => ((item as any).id !== id)));
      
      return true;
    } catch (err) {
      console.error(`Error deleting ${resourceType} resource:`, err);
      return false;
    }
  };
  
  return {
    resources,
    loading,
    error,
    totalCount,
    pageCount,
    refresh: fetchResources,
    addResource,
    updateResource,
    deleteResource
  };
}
