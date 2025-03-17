
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardList } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Diagnosis {
  id: string;
  patient_id: string;
  name: string;
  code?: string;
  icd_code?: string;
  date: string;
  type: string;
  status: string;
  notes?: string;
  diagnosed_by?: string;
}

const PatientDiagnosesTab: React.FC<PatientTabProps> = ({ patientId }) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('diagnoses')
          .select('*')
          .eq('patient_id', patientId)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setDiagnoses(data || []);
      } catch (err: any) {
        console.error("Error fetching diagnoses:", err);
        setError(err.message || "Failed to load diagnoses");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiagnoses();
  }, [patientId]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading diagnoses: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (diagnoses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            No diagnoses recorded for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Diagnoses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {diagnoses.map((diagnosis) => (
            <div key={diagnosis.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="font-medium">{diagnosis.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {diagnosis.date && <span>Diagnosed: {new Date(diagnosis.date).toLocaleDateString()}</span>}
                {diagnosis.status && <span> • Status: {diagnosis.status}</span>}
                {diagnosis.icd_code && <span> • ICD Code: {diagnosis.icd_code}</span>}
              </div>
              {diagnosis.notes && (
                <div className="text-sm mt-1">{diagnosis.notes}</div>
              )}
              {diagnosis.diagnosed_by && (
                <div className="text-xs text-muted-foreground mt-1">By: {diagnosis.diagnosed_by}</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDiagnosesTab;
