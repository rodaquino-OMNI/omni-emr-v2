
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { TestTube } from 'lucide-react';

interface LabResult {
  id: string;
  patient_id: string;
  test_name: string;
  result: string;
  unit: string;
  reference_range: string;
  date: string;
  status: string;
  lab_name?: string;
  notes?: string;
  ordered_by?: string;
}

const PatientLabResultsTab: React.FC<PatientTabProps> = ({ patientId }) => {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLabResults = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('lab_results')
          .select('*')
          .eq('patient_id', patientId)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setLabResults(data || []);
      } catch (err: any) {
        console.error("Error fetching lab results:", err);
        setError(err.message || "Failed to load lab results");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLabResults();
  }, [patientId]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading lab results: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (labResults.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            No lab results recorded for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Lab Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {labResults.map((result) => (
            <div key={result.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="font-medium">{result.test_name}</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-sm text-muted-foreground">Result</div>
                  <div className="font-medium">
                    {result.result} {result.unit}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Reference Range</div>
                  <div>{result.reference_range}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {result.date && <span>Date: {new Date(result.date).toLocaleDateString()}</span>}
                {result.status && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {result.status}
                  </span>
                )}
              </div>
              {result.notes && (
                <div className="text-sm mt-2">{result.notes}</div>
              )}
              {result.lab_name && (
                <div className="text-xs text-muted-foreground mt-1">Lab: {result.lab_name}</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientLabResultsTab;
