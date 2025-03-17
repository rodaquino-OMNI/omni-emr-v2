
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { Droplets, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';

interface FluidRecord {
  id: string;
  patient_id: string;
  date: string;
  type: 'intake' | 'output';
  amount: number;
  unit: string;
  source: string;
  notes?: string;
  recorded_by?: string;
}

const PatientFluidBalanceTab: React.FC<PatientTabProps> = ({ patientId }) => {
  const [fluidRecords, setFluidRecords] = useState<FluidRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFluidRecords = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('fluid_balance')
          .select('*')
          .eq('patient_id', patientId)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setFluidRecords(data || []);
      } catch (err: any) {
        console.error("Error fetching fluid records:", err);
        setError(err.message || "Failed to load fluid balance records");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFluidRecords();
  }, [patientId]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading fluid balance records: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (fluidRecords.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            No fluid balance records for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Group records by date
  const recordsByDate = fluidRecords.reduce((acc: Record<string, FluidRecord[]>, record) => {
    const date = new Date(record.date).toLocaleDateString();
    acc[date] = acc[date] || [];
    acc[date].push(record);
    return acc;
  }, {});
  
  // Sort dates in descending order
  const sortedDates = Object.keys(recordsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Fluid Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const records = recordsByDate[date];
            const intakeRecords = records.filter(r => r.type === 'intake');
            const outputRecords = records.filter(r => r.type === 'output');
            
            const totalIntake = intakeRecords.reduce((sum, r) => sum + r.amount, 0);
            const totalOutput = outputRecords.reduce((sum, r) => sum + r.amount, 0);
            const balance = totalIntake - totalOutput;
            
            return (
              <div key={date} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="font-medium mb-2">{date}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="flex items-center text-blue-700">
                      <ArrowDownToLine className="h-4 w-4 mr-2" />
                      <span className="font-medium">Total Intake</span>
                    </div>
                    <div className="text-xl font-bold text-blue-800 mt-1">{totalIntake} ml</div>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded">
                    <div className="flex items-center text-amber-700">
                      <ArrowUpFromLine className="h-4 w-4 mr-2" />
                      <span className="font-medium">Total Output</span>
                    </div>
                    <div className="text-xl font-bold text-amber-800 mt-1">{totalOutput} ml</div>
                  </div>
                  
                  <div className={`${balance >= 0 ? 'bg-green-50' : 'bg-red-50'} p-3 rounded`}>
                    <div className={`flex items-center ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      <Droplets className="h-4 w-4 mr-2" />
                      <span className="font-medium">Balance</span>
                    </div>
                    <div className={`text-xl font-bold mt-1 ${balance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {balance >= 0 ? '+' : ''}{balance} ml
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <ArrowDownToLine className="h-3 w-3 mr-1 text-blue-600" />
                      Intake Records
                    </h4>
                    {intakeRecords.length > 0 ? (
                      <div className="space-y-2">
                        {intakeRecords.map((record) => (
                          <div key={record.id} className="text-sm border-l-2 border-blue-200 pl-3">
                            <div className="flex justify-between">
                              <span className="font-medium">{record.source}</span>
                              <span>{record.amount} {record.unit}</span>
                            </div>
                            {record.notes && <div className="text-muted-foreground text-xs">{record.notes}</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No intake records for this date.</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <ArrowUpFromLine className="h-3 w-3 mr-1 text-amber-600" />
                      Output Records
                    </h4>
                    {outputRecords.length > 0 ? (
                      <div className="space-y-2">
                        {outputRecords.map((record) => (
                          <div key={record.id} className="text-sm border-l-2 border-amber-200 pl-3">
                            <div className="flex justify-between">
                              <span className="font-medium">{record.source}</span>
                              <span>{record.amount} {record.unit}</span>
                            </div>
                            {record.notes && <div className="text-muted-foreground text-xs">{record.notes}</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No output records for this date.</p>
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

export default PatientFluidBalanceTab;
