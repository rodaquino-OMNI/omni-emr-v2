
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NewEntryFormProps {
  patientId: string;
  onEntryAdded: () => void;
}

const NewEntryForm = ({ patientId, onEntryAdded }: NewEntryFormProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const providerName = user?.name || 'Unknown Provider';
  const providerId = user?.id || 'unknown';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { data, error: insertError } = await supabase
        .from('medical_history_entries')
        .insert({
          patient_id: patientId,
          provider_id: providerId,
          provider_name: providerName,
          title,
          notes,
          entry_date: new Date().toISOString()
        })
        .select();
        
      if (insertError) {
        throw insertError;
      }
      
      // Reset form
      setTitle('');
      setNotes('');
      setIsOpen(false);
      
      // Notify parent component
      onEntryAdded();
      
      // Show success message
      toast.success('Medical history entry added successfully');
    } catch (err) {
      console.error('Error saving entry:', err);
      setError('Failed to save entry. Please try again.');
      toast.error('Failed to save medical history entry');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
            Create a new entry in the patient's medical history. This will be timestamped with your name.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Input id="provider" value={providerName} readOnly className="bg-muted" />
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
              onChange={(e) => setTitle(e.target.value)} 
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
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Enter your observations and notes about this visit"
            />
          </div>
          
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
          
          <DialogFooter className="pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
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
      </DialogContent>
    </Dialog>
  );
};

export default NewEntryForm;
