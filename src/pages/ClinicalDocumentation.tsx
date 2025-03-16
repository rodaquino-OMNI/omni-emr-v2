import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"

const ClinicalDocumentation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast()

  const [note, setNote] = useState('');
  const [patientName, setPatientName] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock patient name loading
    setTimeout(() => {
      setPatientName('John Doe');
    }, 500);
  }, []);

  const handleSaveNote = async () => {
    setIsLoading(true);
    try {
      // Simulate saving the note
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success toast
      toast({
        title: 'Note saved',
        description: 'Your clinical note has been successfully saved.',
        variant: 'success',
      });
      navigate('/records');
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: 'Error',
        description: 'Failed to save the clinical note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Button variant="ghost" onClick={() => navigate('/records')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('back') || 'Back'}
      </Button>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {t('clinicalDocumentation') || 'Clinical Documentation'}
          </h2>
          <p className="text-muted-foreground">
            {t('documentPatientDetails') || 'Document patient details and observations.'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              {t('patientName') || 'Patient Name'}
            </label>
            <p className="text-gray-600">{patientName}</p>
          </div>
          <div>
            <label htmlFor="note" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              {t('clinicalNote') || 'Clinical Note'}
            </label>
            <Textarea
              id="note"
              placeholder={t('enterNote') || 'Enter your clinical note here.'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNote} disabled={isLoading}>
            {isLoading ? t('saving') || 'Saving...' : t('saveNote') || 'Save Note'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClinicalDocumentation;
