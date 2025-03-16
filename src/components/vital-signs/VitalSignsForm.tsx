
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, Activity } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Form schema with validation
const vitalSignsSchema = z.object({
  temperature: z.string().optional(),
  heartRate: z.string().optional(),
  respiratoryRate: z.string().optional(),
  bloodPressureSystolic: z.string().optional(),
  bloodPressureDiastolic: z.string().optional(),
  oxygenSaturation: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  notes: z.string().optional(),
});

export interface VitalSignsFormProps {
  patientId: string;
  patientName?: string;
  visitNoteId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

type FormValues = z.infer<typeof vitalSignsSchema>;

const VitalSignsForm: React.FC<VitalSignsFormProps> = ({ 
  patientId, 
  patientName,
  visitNoteId,
  onClose, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(vitalSignsSchema),
    defaultValues: {
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      notes: '',
    },
  });

  // Function to handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const timestamp = new Date().toISOString();
      
      // Convert string values to numbers where needed
      const vitalSigns = {
        patient_id: patientId,
        visit_note_id: visitNoteId || null,
        timestamp,
        temperature: values.temperature ? parseFloat(values.temperature) : null,
        heart_rate: values.heartRate ? parseInt(values.heartRate) : null,
        respiratory_rate: values.respiratoryRate ? parseInt(values.respiratoryRate) : null,
        blood_pressure_systolic: values.bloodPressureSystolic ? parseInt(values.bloodPressureSystolic) : null,
        blood_pressure_diastolic: values.bloodPressureDiastolic ? parseInt(values.bloodPressureDiastolic) : null,
        oxygen_saturation: values.oxygenSaturation ? parseInt(values.oxygenSaturation) : null,
        weight: values.weight ? parseFloat(values.weight) : null,
        height: values.height ? parseFloat(values.height) : null,
        notes: values.notes || null,
      };

      // Save to database
      const { error: saveError } = await supabase
        .from('vital_signs')
        .insert(vitalSigns);

      if (saveError) {
        throw saveError;
      }

      toast({
        title: "Vital signs recorded",
        description: `Vital signs have been successfully recorded${patientName ? ` for ${patientName}` : ''}.`,
        variant: "success",
      });

      onSuccess();
    } catch (err: any) {
      console.error('Error saving vital signs:', err);
      setError(err.message || 'Failed to save vital signs. Please try again.');
      
      toast({
        title: "Error",
        description: "Failed to save vital signs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperature (°C)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="36.8"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="heartRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heart Rate (bpm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="72"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="respiratoryRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Respiratory Rate (bpm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="16"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="bloodPressureSystolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Systolic (mmHg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="120"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodPressureDiastolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diastolic (mmHg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="oxygenSaturation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>O₂ Saturation (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="98"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="70.5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="175"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional observations"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any additional information or context for these measurements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Save Vital Signs
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VitalSignsForm;
