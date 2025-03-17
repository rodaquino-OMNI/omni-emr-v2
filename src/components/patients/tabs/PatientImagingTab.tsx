
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { ImageIcon } from 'lucide-react';

interface ImagingStudy {
  id: string;
  patient_id: string;
  study_type: string;
  modality: string;
  body_part: string;
  date: string;
  status: string;
  findings?: string;
  conclusion?: string;
  ordered_by?: string;
  performed_by?: string;
  image_url?: string;
}

const PatientImagingTab: React.FC<PatientTabProps> = ({ patientId }) => {
  const [imagingStudies, setImagingStudies] = useState<ImagingStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchImagingStudies = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('imaging_studies')
          .select('*')
          .eq('patient_id', patientId)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setImagingStudies(data || []);
      } catch (err: any) {
        console.error("Error fetching imaging studies:", err);
        setError(err.message || "Failed to load imaging studies");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchImagingStudies();
  }, [patientId]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading imaging studies: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (imagingStudies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            No imaging studies recorded for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Imaging Studies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {imagingStudies.map((study) => (
            <div key={study.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="font-medium">{study.study_type}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {study.date && <span>Date: {new Date(study.date).toLocaleDateString()}</span>}
                {study.modality && <span> • Modality: {study.modality}</span>}
                {study.body_part && <span> • Body Part: {study.body_part}</span>}
                {study.status && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {study.status}
                  </span>
                )}
              </div>
              
              {study.image_url && (
                <div className="mt-2">
                  <img 
                    src={study.image_url} 
                    alt={`${study.study_type} of ${study.body_part}`}
                    className="max-h-48 object-contain rounded border border-gray-200"
                  />
                </div>
              )}
              
              {study.findings && (
                <div className="mt-2">
                  <div className="text-sm font-medium">Findings</div>
                  <div className="text-sm">{study.findings}</div>
                </div>
              )}
              
              {study.conclusion && (
                <div className="mt-2">
                  <div className="text-sm font-medium">Conclusion</div>
                  <div className="text-sm">{study.conclusion}</div>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-x-4">
                {study.ordered_by && <div>Ordered by: {study.ordered_by}</div>}
                {study.performed_by && <div>Performed by: {study.performed_by}</div>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientImagingTab;
