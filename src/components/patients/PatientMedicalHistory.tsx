
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Save, History, FileText } from 'lucide-react';
import MedicalHistoryForm from './MedicalHistoryForm';
import PastMedicalHistoryList from './PastMedicalHistoryList';
import NewEntryForm from './medical-history/NewEntryForm';

type PatientMedicalHistoryProps = {
  patientId: string;
  className?: string;
};

const PatientMedicalHistory = ({ patientId, className }: PatientMedicalHistoryProps) => {
  const [activeTab, setActiveTab] = useState<string>('current');
  const [editMode, setEditMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEntryAdded = () => {
    // Reload the past history list by incrementing the refresh key
    setRefreshKey(prev => prev + 1);
    
    // Switch to the past tab to show the new entry
    setActiveTab('past');
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Medical History</h2>
        <div className="flex items-center gap-2">
          {activeTab === 'current' && !editMode && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Update History
            </Button>
          )}
          {activeTab === 'current' && editMode && (
            <Button 
              size="sm" 
              onClick={() => setEditMode(false)}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          )}
          {activeTab === 'past' && (
            <NewEntryForm 
              patientId={patientId}
              onEntryAdded={handleEntryAdded}
            />
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="current" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Current History
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-1">
                <History className="h-4 w-4" />
                Historical Updates
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="current">
            <MedicalHistoryForm patientId={patientId} editMode={editMode} />
          </TabsContent>
          <TabsContent value="past">
            <PastMedicalHistoryList patientId={patientId} key={refreshKey} />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientMedicalHistory;
