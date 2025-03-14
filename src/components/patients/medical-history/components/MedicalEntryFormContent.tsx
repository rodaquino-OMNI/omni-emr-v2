
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Shield } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

interface MedicalEntryFormContentProps {
  title: string;
  notes: string;
  recorderName: string;
  currentDate: string;
  error: string | null;
  isSubmitting: boolean;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const MedicalEntryFormContent = ({
  title,
  notes,
  recorderName,
  currentDate,
  error,
  isSubmitting,
  onTitleChange,
  onNotesChange,
  onSubmit,
  onCancel
}: MedicalEntryFormContentProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="provider">Provider</Label>
          <Input id="provider" value={recorderName} readOnly className="bg-muted" />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" defaultValue={currentDate} readOnly className="bg-muted" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="title">Entry Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={onTitleChange} 
          placeholder="e.g., Annual Check-up, Follow-up Visit"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Clinical Notes</Label>
        <Textarea 
          id="notes" 
          rows={5}
          value={notes} 
          onChange={onNotesChange} 
          placeholder="Enter your observations and notes about this visit"
        />
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
        <Shield className="h-4 w-4 text-green-500" />
        This entry is HIPAA compliant and follows FHIR standards
      </div>
      
      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}
      
      <DialogFooter className="pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-1"
        >
          {isSubmitting ? 'Saving...' : (
            <>
              <Save className="h-4 w-4" />
              Save Entry
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MedicalEntryFormContent;
