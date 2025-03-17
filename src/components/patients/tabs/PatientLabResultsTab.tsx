
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { PatientTabProps } from '@/types/patient';

/**
 * Tab component to display patient lab results
 * Uses standardized loading patterns and type definitions
 */
const PatientLabResultsTab: React.FC<PatientTabProps> = ({ patientId }) => {
  const [labResults, setLabResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const fetchLabResults = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('lab_results')
          .select('*')
          .eq('patient_id', patientId)
          .order('result_date', { ascending: false });
        
        if (error) throw error;
        
        setLabResults(data || []);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching lab results:', err);
        setError(err.message || 'Failed to fetch lab results');
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
            Error loading lab results: {error}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (labResults.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No lab results available for this patient.</p>
        </CardContent>
      </Card>
    );
  }
  
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return date;
    }
  };
  
  return (
    <div className="space-y-4">
      {labResults.map((result) => (
        <Card key={result.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{result.test_name}</CardTitle>
              <div className="flex items-center gap-2">
                {result.critical && (
                  <Badge variant="destructive">Critical</Badge>
                )}
                {result.abnormal && !result.critical && (
                  <Badge variant="warning">Abnormal</Badge>
                )}
                {!result.abnormal && !result.critical && (
                  <Badge variant="outline">Normal</Badge>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(result.result_date)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Result</h4>
                <p className={`text-lg ${result.critical ? 'text-red-600 font-bold' : result.abnormal ? 'text-amber-600 font-semibold' : ''}`}>
                  {result.result} {result.unit}
                </p>
                {result.reference_range && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Reference Range: {result.reference_range}
                  </p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Ordered By</h4>
                <p>{result.ordering_provider}</p>
                {result.collection_date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Collection Date: {formatDate(result.collection_date)}
                  </p>
                )}
              </div>
            </div>
            {result.notes && (
              <div className="mt-4 pt-2 border-t">
                <h4 className="text-sm font-medium mb-1">Notes</h4>
                <p className="text-sm">{result.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientLabResultsTab;
