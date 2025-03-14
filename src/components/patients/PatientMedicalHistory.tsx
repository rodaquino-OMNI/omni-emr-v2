
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, History } from 'lucide-react';
import { toast } from 'sonner';
import MedicalHistoryForm from './MedicalHistoryForm';
import PastMedicalHistoryList from './PastMedicalHistoryList';
import { useAuditLogger } from './medical-history/hooks/useAuditLogger';
import MedicalHistoryActions from './medical-history/components/MedicalHistoryActions';
import MedicalHistoryHeader from './medical-history/components/MedicalHistoryHeader';
import SecurityBanner from './medical-history/components/SecurityBanner';

type PatientMedicalHistoryProps = {
  patientId: string;
  className?: string;
};

const PatientMedicalHistory = ({ patientId, className }: PatientMedicalHistoryProps) => {
  const [activeTab, setActiveTab] = useState<string>('current');
  const [editMode, setEditMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const { logAuditEvent } = useAuditLogger('PatientMedicalHistory', patientId);

  const handleEntryAdded = () => {
    // Reload the past history list by incrementing the refresh key
    setRefreshKey(prev => prev + 1);
    
    // Switch to the past tab to show the new entry
    setActiveTab('past');
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // In the future, we might want to save the entire medical history form here
      // For now, we'll just show a success message
      
      // Mock a short delay for the "saving" experience
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Log the update action
      await logAuditEvent('update', {
        action: 'update_medical_history',
        patient_id: patientId
      });
      
      setEditMode(false);
      toast.success("Medical history updated successfully");
    } catch (error) {
      console.error('Error saving medical history:', error);
      toast.error("Failed to save medical history");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnterEditMode = () => {
    setEditMode(true);
    logAuditEvent('edit_mode', {
      action: 'entered_edit_mode',
      patient_id: patientId
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <MedicalHistoryHeader>
        <MedicalHistoryActions
          activeTab={activeTab}
          editMode={editMode}
          isSaving={isSaving}
          onEnterEditMode={handleEnterEditMode}
          onSaveChanges={handleSaveChanges}
          onEntryAdded={handleEntryAdded}
        />
      </MedicalHistoryHeader>
      
      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="current" value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            logAuditEvent('view_tab', {
              action: 'viewed_tab',
              tab: value,
              patient_id: patientId
            });
          }}>
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
      
      <SecurityBanner />
    </div>
  );
};

export default PatientMedicalHistory;
