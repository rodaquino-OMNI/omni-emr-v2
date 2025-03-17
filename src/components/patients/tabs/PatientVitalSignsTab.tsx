
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Activity, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Patient, VitalSigns } from '@/types/patientTypes';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import VitalSignsDisplay from '@/components/vital-signs/VitalSignsDisplay';
import VitalSignsChart from '@/components/vital-signs/VitalSignsChart';
import VitalSignsForm from '@/components/vital-signs/VitalSignsForm';
import { format } from 'date-fns';

interface PatientVitalSignsTabProps {
  patientId: string;
}

const PatientVitalSignsTab: React.FC<PatientVitalSignsTabProps> = ({ patientId }) => {
  const [vitals, setVitals] = useState<VitalSigns[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [showVitalSignsForm, setShowVitalSignsForm] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  // Fetch patient basic info
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('id, first_name, last_name')
          .eq('id', patientId)
          .single();
          
        if (error) throw error;
        setPatient(data as Patient);
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };
    
    fetchPatient();
  }, [patientId]);

  // Fetch vital signs
  useEffect(() => {
    const fetchVitalSigns = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('vital_signs')
          .select('*')
          .eq('patient_id', patientId)
          .order('timestamp', { ascending: false });
        
        if (error) throw error;
        
        setVitals(data || []);
      } catch (error) {
        console.error('Error fetching vital signs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchVitalSigns();
    }
  }, [patientId]);

  const handleVitalSignsAdded = () => {
    setShowVitalSignsForm(false);
    // Refetch vital signs
    const fetchVitalSigns = async () => {
      try {
        const { data, error } = await supabase
          .from('vital_signs')
          .select('*')
          .eq('patient_id', patientId)
          .order('timestamp', { ascending: false });
        
        if (error) throw error;
        
        setVitals(data || []);
      } catch (error) {
        console.error('Error fetching vital signs:', error);
      }
    };

    fetchVitalSigns();
  };

  const patientName = patient ? `${patient.first_name} ${patient.last_name}` : '';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Vital Signs
        </h2>
        <Button onClick={() => setShowVitalSignsForm(true)} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Vitals
        </Button>
      </div>
      
      <Sheet open={showVitalSignsForm} onOpenChange={setShowVitalSignsForm}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Add Vital Signs</SheetTitle>
            <SheetDescription>
              Record new vital signs for {patientName}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <VitalSignsForm 
              patientId={patientId}
              patientName={patientName}
              onClose={() => setShowVitalSignsForm(false)}
              onSuccess={handleVitalSignsAdded}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">
            <Activity className="h-4 w-4 mr-2" />
            Current
          </TabsTrigger>
          <TabsTrigger value="history">
            <BarChart3 className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading vital signs...</p>
            </div>
          ) : vitals.length > 0 ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Latest Vital Signs</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Recorded on {format(new Date(vitals[0].timestamp), 'PPP p')}
                </p>
              </CardHeader>
              <CardContent>
                <VitalSignsDisplay vitals={vitals[0]} />
              </CardContent>
              <CardFooter className="bg-muted/30 pt-2">
                <div className="text-xs text-muted-foreground">
                  {vitals.length > 1 ? `${vitals.length} records available` : '1 record available'}
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No vital signs recorded yet</p>
                <Button onClick={() => setShowVitalSignsForm(true)} variant="outline" className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add First Record
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading vital signs history...</p>
            </div>
          ) : vitals.length > 0 ? (
            <div className="space-y-6">
              <VitalSignsChart vitals={vitals} />
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">History Records ({vitals.length})</h3>
                <div className="space-y-3">
                  {vitals.map((vital, index) => (
                    <Card key={vital.id} className="overflow-hidden">
                      <CardHeader className="py-3 px-4 bg-muted/40">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">
                            {format(new Date(vital.timestamp), 'PPP p')}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {vital.taken_by ? `Recorded by: ${vital.taken_by}` : 'Recorded in system'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <VitalSignsDisplay vitals={vital} isCompact={true} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No vital signs history available</p>
                <Button onClick={() => setShowVitalSignsForm(true)} variant="outline" className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add First Record
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientVitalSignsTab;
