
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Calendar, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface FHIRConditionsListProps {
  patientId: string;
}

const FHIRConditionsList = ({ patientId }: FHIRConditionsListProps) => {
  const [loading, setLoading] = useState(true);
  const [conditions, setConditions] = useState<any[]>([]);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from FHIR-compliant conditions table
        const { data, error } = await supabase
          .from('conditions')
          .select('*')
          .eq('subject_id', patientId);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setConditions(data);
        } else {
          // Fallback to legacy diagnoses table
          const { data: legacyData, error: legacyError } = await supabase
            .from('diagnoses')
            .select('*')
            .eq('patient_id', patientId)
            .order('diagnosed_date', { ascending: false });
            
          if (legacyError) throw legacyError;
          
          setConditions(legacyData || []);
        }
      } catch (error) {
        console.error('Error fetching conditions:', error);
        setConditions([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (patientId) {
      fetchConditions();
    }
  }, [patientId]);
  
  // Helper function to extract condition name from FHIR format
  const getConditionName = (condition: any): string => {
    // Check if we have FHIR format with code object
    if (condition.code && typeof condition.code === 'object') {
      // Try to get from text property
      if ('text' in condition.code) {
        return condition.code.text;
      }
      
      // Try to get from coding array
      if ('coding' in condition.code && Array.isArray(condition.code.coding) && condition.code.coding.length > 0) {
        return condition.code.coding[0].display || condition.code.coding[0].code || 'Unknown Condition';
      }
    }
    
    // Fallback to legacy format
    return condition.diagnosis || 'Unknown Condition';
  };
  
  // Helper function to get condition status
  const getConditionStatus = (condition: any): string => {
    // Check for FHIR format
    if (condition.clinical_status && typeof condition.clinical_status === 'object') {
      if ('coding' in condition.clinical_status && Array.isArray(condition.clinical_status.coding) && condition.clinical_status.coding.length > 0) {
        return condition.clinical_status.coding[0].code;
      }
    }
    
    // Fallback to legacy format
    return condition.status || 'active';
  };
  
  // Helper function to get onset date
  const getOnsetDate = (condition: any): string => {
    // Check for FHIR format
    if (condition.onset_date_time) {
      return formatDate(condition.onset_date_time);
    }
    
    // Fallback to legacy format
    return formatDate(condition.diagnosed_date);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Get status class
  const getStatusClass = (status: string): string => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('active')) {
      return 'bg-green-50 text-green-800 border-green-200';
    } else if (statusLower.includes('resolved') || statusLower.includes('inactive')) {
      return 'bg-slate-50 text-slate-800 border-slate-200';
    } else if (statusLower.includes('recurrence')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!conditions.length) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <Activity className="h-12 w-12 text-green-500 mb-2" />
            <h3 className="text-lg font-medium">No Conditions</h3>
            <p className="text-muted-foreground mt-1">No conditions or diagnoses have been recorded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Conditions & Diagnoses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conditions.map((condition, index) => {
            const conditionName = getConditionName(condition);
            const status = getConditionStatus(condition);
            const onsetDate = getOnsetDate(condition);
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-md border ${getStatusClass(status)}`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{conditionName}</h3>
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      status.toLowerCase().includes('active') ? 'bg-green-100 text-green-800' : 
                      status.toLowerCase().includes('resolved') ? 'bg-slate-100 text-slate-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Onset/Diagnosis: {onsetDate}</span>
                  </div>
                  
                  {/* Show ICD code if available */}
                  {condition.icd_code && (
                    <div className="flex items-center text-sm text-muted-foreground gap-1">
                      <Info className="h-3 w-3" />
                      <span>ICD-10: {condition.icd_code}</span>
                    </div>
                  )}
                  
                  {/* Show notes if available */}
                  {condition.notes && (
                    <div className="mt-2 text-sm italic">
                      "{condition.notes}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FHIRConditionsList;
