
import { z } from 'zod';

// Define the form schema
export const consultationFormSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required" }),
  patientName: z.string().min(1, { message: "Patient name is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  notes: z.string().optional(),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  duration: z.number().min(5, { message: "Duration must be at least 5 minutes" }),
  location: z.string().min(1, { message: "Location is required" }),
  type: z.enum(["in-person", "telemedicine", "phone"] as const),
  sendReminder: z.boolean().default(true),
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export interface ScheduleConsultationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  preselectedPatientId?: string;
  preselectedDate?: Date;
}
