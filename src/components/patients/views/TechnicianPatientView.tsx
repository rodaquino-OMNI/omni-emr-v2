
import React, { useState } from 'react';
import { usePatientContext } from '@/context/PatientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';
import { Thermometer, HeartPulse, FilePen, Clipboard, AlertTriangle } from 'lucide-react';

const TechnicianPatientView: React.FC = () => {
  const { patient, isLoading } = usePatientContext();
  const { t } = useTranslation();
  const [hasAbnormalFindings, setHasAbnormalFindings] = useState(false);
  
  if (isLoading) {
    return <div>Loading patient data...</div>;
  }
  
  if (!patient) {
    return <div>No patient data available</div>;
  }
  
  // Toggle abnormal findings for demo
  const toggleAbnormalFindings = () => {
    setHasAbnormalFindings(!hasAbnormalFindings);
  };
  
  return (
    <div className="space-y-6">
      {/* Alert for abnormal findings */}
      {hasAbnormalFindings && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Abnormal Findings Detected</AlertTitle>
          <AlertDescription>
            Elevated temperature (39.2°C) and heart rate (112 bpm) detected. Please notify the nurse or physician.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Data collection sections */}
      <Tabs defaultValue="vitals">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="vitals">
            <HeartPulse className="h-4 w-4 mr-2" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="specimens">
            <Clipboard className="h-4 w-4 mr-2" />
            Specimens
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FilePen className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simplified version for technicians */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="temperature" className="text-sm font-medium">Temperature (°C)</label>
                  <input 
                    type="number" 
                    id="temperature" 
                    step="0.1"
                    className="w-full p-2 border rounded-md" 
                    defaultValue={hasAbnormalFindings ? "39.2" : ""}
                    onChange={toggleAbnormalFindings}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="heart-rate" className="text-sm font-medium">Heart Rate (bpm)</label>
                  <input 
                    type="number" 
                    id="heart-rate" 
                    className="w-full p-2 border rounded-md" 
                    defaultValue={hasAbnormalFindings ? "112" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bp" className="text-sm font-medium">Blood Pressure</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      id="bp-systolic" 
                      className="w-full p-2 border rounded-md" 
                      placeholder="Systolic"
                    />
                    <span className="p-2">/</span>
                    <input 
                      type="number" 
                      id="bp-diastolic" 
                      className="w-full p-2 border rounded-md" 
                      placeholder="Diastolic"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="oxygen" className="text-sm font-medium">Oxygen Saturation (%)</label>
                  <input 
                    type="number" 
                    id="oxygen" 
                    className="w-full p-2 border rounded-md" 
                  />
                </div>
              </div>
              <Button className="mt-4 w-full">Save Vital Signs</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specimens" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Specimen Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="specimen-type" className="text-sm font-medium">Specimen Type</label>
                  <select id="specimen-type" className="w-full p-2 border rounded-md">
                    <option value="">Select type...</option>
                    <option value="blood">Blood</option>
                    <option value="urine">Urine</option>
                    <option value="stool">Stool</option>
                    <option value="sputum">Sputum</option>
                    <option value="swab">Swab</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="collection-time" className="text-sm font-medium">Collection Time</label>
                  <input 
                    type="datetime-local" 
                    id="collection-time" 
                    className="w-full p-2 border rounded-md" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lab-test" className="text-sm font-medium">Lab Test</label>
                  <select id="lab-test" className="w-full p-2 border rounded-md">
                    <option value="">Select test...</option>
                    <option value="cbc">Complete Blood Count</option>
                    <option value="cmp">Comprehensive Metabolic Panel</option>
                    <option value="urinalysis">Urinalysis</option>
                    <option value="culture">Culture and Sensitivity</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="specimen-notes" className="text-sm font-medium">Notes</label>
                  <textarea 
                    id="specimen-notes" 
                    className="w-full p-2 border rounded-md" 
                    rows={3}
                  ></textarea>
                </div>
                
                <Button className="w-full">Record Specimen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technician Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="note-type" className="text-sm font-medium">Note Type</label>
                  <select id="note-type" className="w-full p-2 border rounded-md">
                    <option value="observation">Observation</option>
                    <option value="procedure">Procedure</option>
                    <option value="equipment">Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="note-content" className="text-sm font-medium">Note Content</label>
                  <textarea 
                    id="note-content" 
                    className="w-full p-2 border rounded-md" 
                    rows={5}
                    placeholder="Enter your notes here..."
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="flag-for-review" 
                    className="rounded" 
                  />
                  <label htmlFor="flag-for-review" className="text-sm">Flag for provider review</label>
                </div>
                
                <Button className="w-full">Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianPatientView;
