
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNewEntryForm } from './hooks/useNewEntryForm';
import MedicalEntryFormContent from './components/MedicalEntryFormContent';

interface NewEntryFormProps {
  patientId: string;
  onEntryAdded: () => void;
}

const NewEntryForm = ({ patientId, onEntryAdded }: NewEntryFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    title,
    setTitle,
    notes,
    setNotes,
    isSubmitting,
    error,
    recorderName,
    currentDate,
    handleSubmit
  } = useNewEntryForm({
    patientId,
    onEntryAdded,
    onClose: () => setIsOpen(false)
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Medical History Entry</DialogTitle>
          <DialogDescription>
            Create a new FHIR-compliant entry in the patient's medical history.
          </DialogDescription>
        </DialogHeader>
        
        <MedicalEntryFormContent
          title={title}
          notes={notes}
          recorderName={recorderName}
          currentDate={currentDate}
          error={error}
          isSubmitting={isSubmitting}
          onTitleChange={(e) => setTitle(e.target.value)}
          onNotesChange={(e) => setNotes(e.target.value)}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewEntryForm;
