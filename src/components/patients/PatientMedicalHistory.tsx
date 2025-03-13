
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Save, History, FileText } from 'lucide-react';
import MedicalHistoryForm from './MedicalHistoryForm';
import PastMedicalHistoryList from './PastMedicalHistoryList';

type PatientMedicalHistoryProps = {
  patientId: string;
  className?: string;
};

const PatientMedicalHistory = ({ patientId, className }: PatientMedicalHistoryProps) => {
  const [activeTab, setActiveTab] = useState<string>('current');
  const [editMode, setEditMode] = useState(false);

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
            <PastMedicalHistoryList patientId={patientId} />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientMedicalHistory;
