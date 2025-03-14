
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, AlertCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface FHIRAllergiesListProps {
  patientId: string;
}

const FHIRAllergiesList = ({ patientId }: FHIRAllergiesListProps) => {
  const [loading, setLoading] = useState(true);
  const [allergies, setAllergies] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from FHIR-compliant allergy_intolerances table
        const { data, error } = await supabase
          .from('allergy_intolerances')
          .select('*')
          .eq('patient_id', patientId);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setAllergies(data);
        } else {
          // Fallback to legacy allergies table
          const { data: legacyData, error: legacyError } = await supabase
            .from('allergies')
            .select('*')
            .eq('patient_id', patientId)
            .eq('is_active', true);
            
          if (legacyError) throw legacyError;
          
          setAllergies(legacyData || []);
        }
      } catch (error) {
        console.error('Error fetching allergies:', error);
        setAllergies([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (patientId) {
      fetchAllergies();
    }
  }, [patientId]);
  
  // Helper function to extract allergy name from FHIR format
  const getAllergenName = (allergy: any): string => {
    // Check if we have FHIR format with code object
    if (allergy.code && typeof allergy.code === 'object') {
      // Try to get from text property
      if ('text' in allergy.code) {
        return allergy.code.text;
      }
      
      // Try to get from coding array
      if ('coding' in allergy.code && Array.isArray(allergy.code.coding) && allergy.code.coding.length > 0) {
        return allergy.code.coding[0].display || allergy.code.coding[0].code || 'Unknown Allergen';
      }
    }
    
    // Fallback to legacy format
    return allergy.allergen || 'Unknown Allergen';
  };
  
  // Helper function to get reaction details
  const getReactionDetails = (allergy: any): { reaction: string, severity: string } => {
    // Check for FHIR format
    if (allergy.reaction && Array.isArray(allergy.reaction) && allergy.reaction.length > 0) {
      const reactionObj = allergy.reaction[0];
      
      // Get manifestation
      let reaction = '';
      if (reactionObj.manifestation && Array.isArray(reactionObj.manifestation) && reactionObj.manifestation.length > 0) {
        const manifestation = reactionObj.manifestation[0];
        reaction = typeof manifestation === 'object' && 'text' in manifestation ? manifestation.text : '';
      }
      
      // Get severity
      let severity = '';
      if ('severity' in reactionObj) {
        severity = reactionObj.severity;
      }
      
      return { reaction, severity };
    }
    
    // Fallback to legacy format
    return { 
      reaction: allergy.reaction || '', 
      severity: allergy.severity || ''
    };
  };
  
  // Helper function to determine if the allergy is active
  const isAllergyActive = (allergy: any): boolean => {
    // Check FHIR format
    if (allergy.clinical_status && typeof allergy.clinical_status === 'object') {
      if ('coding' in allergy.clinical_status && Array.isArray(allergy.clinical_status.coding) && allergy.clinical_status.coding.length > 0) {
        const code = allergy.clinical_status.coding[0].code;
        return code === 'active';
      }
    }
    
    // Legacy format
    return allergy.is_active !== false;
  };
  
  // Get severity level class
  const getSeverityClass = (severity: string): string => {
    const severityLower = severity.toLowerCase();
    
    if (severityLower.includes('severe') || severityLower.includes('high')) {
      return 'bg-red-50 text-red-800 border-red-200';
    } else if (severityLower.includes('moderate') || severityLower.includes('medium')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    } else if (severityLower.includes('mild') || severityLower.includes('low')) {
      return 'bg-green-50 text-green-800 border-green-200';
    }
    
    return 'bg-slate-50 text-slate-800 border-slate-200';
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

  if (!allergies.length) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <Shield className="h-12 w-12 text-green-500 mb-2" />
            <h3 className="text-lg font-medium">No Known Allergies</h3>
            <p className="text-muted-foreground mt-1">No allergies have been recorded for this patient</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Allergies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allergies.filter(isAllergyActive).map((allergy, index) => {
            const allergenName = getAllergenName(allergy);
            const { reaction, severity } = getReactionDetails(allergy);
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-md border ${getSeverityClass(severity)}`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className={`h-5 w-5 ${
                    severity.toLowerCase().includes('severe') ? 'text-red-600' : 
                    severity.toLowerCase().includes('moderate') ? 'text-amber-600' : 
                    'text-blue-600'
                  }`} />
                  <div>
                    <h3 className="font-medium">{allergenName}</h3>
                    {reaction && (
                      <p className="text-sm mt-1">Reaction: {reaction}</p>
                    )}
                    {severity && (
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          severity.toLowerCase().includes('severe') ? 'bg-red-100 text-red-800' : 
                          severity.toLowerCase().includes('moderate') ? 'bg-amber-100 text-amber-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {severity}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FHIRAllergiesList;
