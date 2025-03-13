
import React, { useState, useEffect } from 'react';
import { useAIInsights } from '@/hooks/useAIInsights';
import AIInsights from '../ai/AIInsights';
import { FileText, Calendar, Download, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type PatientRecordsProps = {
  patientId: string;
};

type MedicalRecord = {
  id: string;
  title: string;
  type: 'lab' | 'imaging' | 'visit' | 'procedure';
  date: Date;
  provider: string;
};

const PatientRecords = ({ patientId }: PatientRecordsProps) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get AI insights specifically for labs/records
  const { insights, loading: insightsLoading } = useAIInsights(patientId, ['labs']);
  
  useEffect(() => {
    // This would normally be an API call to fetch the patient's medical records
    const fetchRecords = async () => {
      setLoading(true);
      try {
        // Mock data - in a real app, this would be fetched from an API
        const mockRecords: MedicalRecord[] = [
          {
            id: '1',
            title: 'Complete Blood Count',
            type: 'lab',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            provider: 'Dr. Sarah Chen'
          },
          {
            id: '2',
            title: 'Chest X-Ray',
            type: 'imaging',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
            provider: 'Radiology Dept'
          },
          {
            id: '3',
            title: 'Annual Physical Examination',
            type: 'visit',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
            provider: 'Dr. Michael Johnson'
          },
          {
            id: '4',
            title: 'Lipid Panel',
            type: 'lab',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
            provider: 'Lab Services'
          },
          {
            id: '5',
            title: 'EKG Results',
            type: 'procedure',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), // 3 weeks ago
            provider: 'Cardiology Dept'
          }
        ];
        
        // Sort by date (newest first)
        const sortedRecords = mockRecords.sort((a, b) => 
          b.date.getTime() - a.date.getTime()
        );
        
        setRecords(sortedRecords);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecords();
  }, [patientId]);
  
  const getRecordIcon = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'lab':
        return <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>;
      case 'imaging':
        return <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-purple-600" />
        </div>;
      case 'visit':
        return <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-green-600" />
        </div>;
      case 'procedure':
        return <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>;
      default:
        return <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-gray-600" />
        </div>;
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Show AI insights related to labs/records if available */}
      {insights.length > 0 && !insightsLoading && (
        <AIInsights 
          insights={insights}
          showSource={false}
        />
      )}
      
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Medical Records</h2>
          <Link to={`/patients/${patientId}/medical-history`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              Medical History
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-muted-foreground">Loading records...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  {getRecordIcon(record.type)}
                  <div className="flex-1">
                    <Link to={`/records/${record.id}`}>
                      <h3 className="font-medium hover:text-primary transition-colors">{record.title}</h3>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
                      <div>{formatDate(record.date)}</div>
                      <div className="hidden sm:block">•</div>
                      <div>{record.provider}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No medical records found for this patient.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
