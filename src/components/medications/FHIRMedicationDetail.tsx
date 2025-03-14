import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Clock, Calendar, Info, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface FHIRMedicationDetailProps {
  medicationRequestId: string;
}

const FHIRMedicationDetail = ({ medicationRequestId }: FHIRMedicationDetailProps) => {
  const [loading, setLoading] = useState(true);
  const [medication, setMedication] = useState<any>(null);
  const [practitionerName, setPractitionerName] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');

  useEffect(() => {
    const fetchMedicationRequest = async () => {
      try {
        setLoading(true);
        
        // Fetch the medication request
        const { data: medicationData, error } = await supabase
          .from('medication_requests')
          .select('*')
          .eq('id', medicationRequestId)
          .single();
          
        if (error) throw error;
        
        // Set the base medication data
        setMedication(medicationData);
        
        // Fetch the practitioner name
        if (medicationData.requester_id) {
          const { data: practitionerData } = await supabase
            .from('practitioners')
            .select('name')
            .eq('id', medicationData.requester_id)
            .single();
            
          if (practitionerData && practitionerData.name) {
            // Extract practitioner name from FHIR format
            const nameObj = typeof practitionerData.name === 'object' ? practitionerData.name : {};
            const given = Array.isArray(nameObj.given) ? nameObj.given.join(' ') : '';
            const family = nameObj.family || '';
            setPractitionerName(`${given} ${family}`.trim() || 'Unknown Provider');
          }
        }
        
        // Fetch the patient name
        if (medicationData.subject_id) {
          const { data: patientData } = await supabase
            .from('patients')
            .select('first_name, last_name')
            .eq('id', medicationData.subject_id)
            .single();
            
          if (patientData) {
            setPatientName(`${patientData.first_name} ${patientData.last_name}`.trim());
          }
        }
      } catch (error) {
        console.error('Error fetching medication request:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (medicationRequestId) {
      fetchMedicationRequest();
    }
  }, [medicationRequestId]);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Extract medication name from FHIR codeable concept
  const getMedicationName = () => {
    if (!medication) return 'Loading...';
    const concept = medication.medication_codeable_concept;
    if (!concept) return 'Unknown Medication';
    
    if (typeof concept === 'object' && 'text' in concept) {
      return concept.text;
    }
    
    // Try to extract from coding array if text is not available
    if (typeof concept === 'object' && 'coding' in concept && Array.isArray(concept.coding) && concept.coding.length > 0) {
      return concept.coding[0].display || concept.coding[0].code || 'Unknown Medication';
    }
    
    return 'Unknown Medication';
  };
  
  // Extract dosage instructions from FHIR format
  const getDosageInstructions = () => {
    if (!medication || !medication.dosage_instruction) return [];
    
    const instructions = Array.isArray(medication.dosage_instruction) 
      ? medication.dosage_instruction 
      : [];
      
    return instructions.map((instruction: any, index: number) => {
      // Try to extract text directly
      if (typeof instruction === 'object' && 'text' in instruction) {
        return { id: index, text: instruction.text };
      }
      
      // Otherwise, build from structured data
      let text = '';
      
      // Extract route
      if (instruction.route && typeof instruction.route === 'object' && 'text' in instruction.route) {
        text += `${instruction.route.text} `;
      }
      
      // Extract dose and rate
      if (instruction.doseAndRate && Array.isArray(instruction.doseAndRate) && instruction.doseAndRate.length > 0) {
        const doseQuantity = instruction.doseAndRate[0].doseQuantity;
        if (doseQuantity && typeof doseQuantity === 'object') {
          text += `${doseQuantity.value || ''} ${doseQuantity.unit || ''} `;
        }
      }
      
      // Extract timing
      if (instruction.timing && typeof instruction.timing === 'object') {
        if (instruction.timing.code && typeof instruction.timing.code === 'object' && 'text' in instruction.timing.code) {
          text += instruction.timing.code.text;
        }
      }
      
      return { id: index, text: text.trim() || 'No detailed instructions available' };
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!medication) {
    return <div className="text-center py-8 text-muted-foreground">Medication not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medication Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium flex items-center gap-2 mb-2">
                <Info className="h-4 w-4" />
                Medication
              </h3>
              <p className="text-lg font-semibold">{getMedicationName()}</p>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  medication.status === 'active' ? 'bg-green-100 text-green-800' : 
                  medication.status === 'on-hold' ? 'bg-amber-100 text-amber-800' : 
                  medication.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {medication.status.toUpperCase()}
                </span>
                {medication.priority && (
                  <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                    medication.priority === 'urgent' ? 'bg-orange-100 text-orange-800' : 
                    medication.priority === 'stat' || medication.priority === 'asap' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {medication.priority.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-md">
              <h3 className="font-medium flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Prescription Information
              </h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Prescribed by:</span> {practitionerName || 'Unknown Provider'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Patient:</span> {patientName || 'Unknown Patient'}
                </p>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">Prescribed on:</span> {formatDate(medication.authored_on)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-md border">
            <h3 className="font-medium flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4" />
              Dosage & Instructions
            </h3>
            <div className="space-y-3">
              {getDosageInstructions().map((instruction) => (
                <div key={instruction.id} className="p-2 bg-slate-50 rounded">
                  <p className="text-sm">{instruction.text}</p>
                </div>
              ))}
              {getDosageInstructions().length === 0 && (
                <p className="text-sm text-muted-foreground">No specific instructions provided</p>
              )}
            </div>
          </div>
          
          {/* Notes Section */}
          {medication.note && Array.isArray(medication.note) && medication.note.length > 0 && (
            <div className="p-4 bg-white rounded-md border">
              <h3 className="font-medium flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4" />
                Notes
              </h3>
              <div className="space-y-2">
                {medication.note.map((note: any, index: number) => (
                  <div key={index} className="p-2 bg-slate-50 rounded">
                    <p className="text-sm">{typeof note === 'object' && 'text' in note ? note.text : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Substitution Information */}
          {medication.substitution && (
            <div className="mt-4 p-4 bg-slate-50 rounded-md">
              <h3 className="font-medium mb-2">Substitution</h3>
              <p className="text-sm">
                {typeof medication.substitution === 'object' && 'allowed' in medication.substitution 
                  ? (medication.substitution.allowed ? 'Generic substitution is allowed' : 'No substitution allowed') 
                  : 'Substitution information not available'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Display potential medication interaction warnings */}
      {medication.detected_issue && Array.isArray(medication.detected_issue) && medication.detected_issue.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 text-red-800">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Medication Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-2">
            <div className="space-y-2">
              {medication.detected_issue.map((issue: any, index: number) => (
                <div key={index} className="p-3 bg-red-50 rounded border border-red-200">
                  <h4 className="font-medium">
                    {typeof issue === 'object' && 'detail' in issue ? issue.detail : 'Potential issue detected'}
                  </h4>
                  <p className="text-sm mt-1">
                    {typeof issue === 'object' && 'severity' in issue ? `Severity: ${issue.severity}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FHIRMedicationDetail;
