
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save } from 'lucide-react';
import NewEntryForm from '../NewEntryForm';

interface MedicalHistoryActionsProps {
  activeTab: string;
  editMode: boolean;
  isSaving: boolean;
  onEnterEditMode: () => void;
  onSaveChanges: () => void;
  onEntryAdded: () => void;
}

const MedicalHistoryActions = ({
  activeTab,
  editMode,
  isSaving,
  onEnterEditMode,
  onSaveChanges,
  onEntryAdded
}: MedicalHistoryActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      {activeTab === 'current' && !editMode && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEnterEditMode}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Update History
        </Button>
      )}
      {activeTab === 'current' && editMode && (
        <Button 
          size="sm" 
          onClick={onSaveChanges}
          disabled={isSaving}
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      )}
      {activeTab === 'past' && (
        <NewEntryForm 
          patientId={null} // This will be passed through props in the parent
          onEntryAdded={onEntryAdded}
        />
      )}
    </div>
  );
};

export default MedicalHistoryActions;
