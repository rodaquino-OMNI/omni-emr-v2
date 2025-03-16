
/**
 * Hook for working with FHIR resources in the improved FHIR-compliant database
 */
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, logEnhancedAuditEvent } from '@/integrations/supabase/client'; 

interface UseFHIRResourcesProps {
  resourceType: string;
  patientId?: string;
  filters?: Record<string, any>;
  enabled?: boolean;
}

/**
 * Hook to fetch and interact with FHIR resources
 * with built-in HIPAA-compliant audit logging
 */
export const useFHIRResources = <T extends Record<string, any>>({
  resourceType,
  patientId,
  filters = {},
  enabled = true
}: UseFHIRResourcesProps) => {
  const [resources, setResources] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  // Function to determine the appropriate table name from the FHIR resource type
  const getTableName = (type: string): string => {
    // Map FHIR resource types to Supabase table names
    const resourceTypeToTable: Record<string, string> = {
      'Patient': 'patients',
      'Observation': 'observations',
      'Condition': 'conditions',
      'AllergyIntolerance': 'allergy_intolerances',
      'MedicationRequest': 'medication_requests',
      'Encounter': 'encounters',
      'Immunization': 'immunizations',
      'FamilyMemberHistory': 'family_member_histories',
      'DocumentReference': 'document_references',
      'CarePlan': 'care_plans',
      'Device': 'devices',
      'VitalSigns': 'vital_signs' // Custom mapping for vital signs
    };
    
    return resourceTypeToTable[type] || type.toLowerCase() + 's';
  };
  
  // Get the subject ID field name based on resource type
  const getSubjectField = (type: string): string => {
    const resourceTypeToSubjectField: Record<string, string> = {
      'Patient': 'id',
      'AllergyIntolerance': 'patient_id',
      'VitalSigns': 'patient_id'
    };
    
    return resourceTypeToSubjectField[type] || 'subject_id';
  };
  
  // Function to fetch resources
  const fetchResources = async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const tableName = getTableName(resourceType);
      const subjectField = getSubjectField(resourceType);
      
      // Build the query
      let query = supabase.from(tableName).select('*');
      
      // Add patient filter if provided
      if (patientId) {
        query = query.eq(subjectField, patientId);
      }
      
      // Add any additional filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
      
      // Execute the query
      const { data, error: queryError } = await query.order('created_at', { ascending: false });
      
      if (queryError) {
        throw new Error(`Error fetching ${resourceType}: ${queryError.message}`);
      }
      
      // Log the access for HIPAA compliance
      if (user?.id && patientId) {
        await logEnhancedAuditEvent({
          userId: user.id,
          action: 'access',
          resourceType,
          resourceId: patientId, // Use patient ID as resource ID for logging
          patientId,
          accessType: 'standard_access',
          accessReason: 'clinical_review',
          details: {
            resourceCountRetrieved: data?.length || 0,
            filters: { ...filters, [subjectField]: patientId }
          }
        });
      }
      
      setResources(data || []);
    } catch (err) {
      console.error(`Error in useFHIRResources for ${resourceType}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  // Create a resource
  const createResource = async (resource: Omit<T, 'id'>): Promise<T | null> => {
    try {
      const tableName = getTableName(resourceType);
      
      // Add version tracking and timestamps
      const resourceWithVersion = {
        ...resource,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Insert into the database
      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert(resourceWithVersion)
        .select()
        .single();
        
      if (insertError) {
        throw new Error(`Error creating ${resourceType}: ${insertError.message}`);
      }
      
      // Log the action for HIPAA compliance
      if (user?.id && 'patient_id' in resource) {
        await logEnhancedAuditEvent({
          userId: user.id,
          action: 'create',
          resourceType,
          resourceId: data.id,
          patientId: resource.patient_id as string,
          accessType: 'standard_access',
          accessReason: 'clinical_documentation',
          details: {
            resourceCreated: resourceType
          }
        });
      }
      
      // Update local state
      setResources(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      console.error(`Error creating ${resourceType}:`, err);
      return null;
    }
  };
  
  // Update a resource
  const updateResource = async (id: string, updates: Partial<T>): Promise<T | null> => {
    try {
      const tableName = getTableName(resourceType);
      
      // Add updated timestamp
      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Update in the database
      const { data, error: updateError } = await supabase
        .from(tableName)
        .update(updatesWithTimestamp)
        .eq('id', id)
        .select()
        .single();
        
      if (updateError) {
        throw new Error(`Error updating ${resourceType}: ${updateError.message}`);
      }
      
      // Log the action for HIPAA compliance
      if (user?.id) {
        // Get patient ID from the resource itself
        const patientId = 
          (data.patient_id as string) || 
          (data.subject_id as string) || 
          (resourceType === 'Patient' ? data.id : undefined);
          
        if (patientId) {
          await logEnhancedAuditEvent({
            userId: user.id,
            action: 'update',
            resourceType,
            resourceId: id,
            patientId,
            accessType: 'standard_access',
            accessReason: 'clinical_documentation',
            details: {
              updatedFields: Object.keys(updates)
            }
          });
        }
      }
      
      // Update local state
      setResources(prev => prev.map(r => r.id === id ? data : r));
      
      return data;
    } catch (err) {
      console.error(`Error updating ${resourceType}:`, err);
      return null;
    }
  };
  
  // Delete a resource
  const deleteResource = async (id: string): Promise<boolean> => {
    try {
      const tableName = getTableName(resourceType);
      
      // For HIPAA compliance, get the resource details before deletion to log patient ID
      const { data: resourceData } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
        
      // Delete from the database
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
      if (deleteError) {
        throw new Error(`Error deleting ${resourceType}: ${deleteError.message}`);
      }
      
      // Log the action for HIPAA compliance
      if (user?.id && resourceData) {
        // Get patient ID from the resource itself
        const patientId = 
          (resourceData.patient_id as string) || 
          (resourceData.subject_id as string) || 
          (resourceType === 'Patient' ? resourceData.id : undefined);
          
        if (patientId) {
          await logEnhancedAuditEvent({
            userId: user.id,
            action: 'delete',
            resourceType,
            resourceId: id,
            patientId,
            accessType: 'standard_access',
            accessReason: 'clinical_documentation_management',
            details: {
              resourceDeleted: resourceType
            }
          });
        }
      }
      
      // Update local state
      setResources(prev => prev.filter(r => r.id !== id));
      
      return true;
    } catch (err) {
      console.error(`Error deleting ${resourceType}:`, err);
      return false;
    }
  };
  
  // Fetch resources when dependencies change
  useEffect(() => {
    fetchResources();
  }, [resourceType, patientId, JSON.stringify(filters), enabled]);
  
  return {
    resources,
    loading,
    error,
    refresh: fetchResources,
    createResource,
    updateResource,
    deleteResource
  };
};
