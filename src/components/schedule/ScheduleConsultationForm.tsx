
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { 
  createAppointment, 
  AppointmentType, 
  AppointmentStatus
} from '@/services/appointmentService';

import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  Clock, 
  UserRound, 
  Building2, 
  Phone, 
  Video, 
  Bell 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// Define the form schema
const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

// Mock data for patients and providers
const mockPatients = [
  { id: 'pat1', name: 'John Smith' },
  { id: 'pat2', name: 'Maria Garcia' },
  { id: 'pat3', name: 'Ahmed Khan' },
  { id: 'pat4', name: 'Sarah Johnson' },
  { id: 'pat5', name: 'Li Wei' },
];

interface ScheduleConsultationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  preselectedPatientId?: string;
  preselectedDate?: Date;
}

const ScheduleConsultationForm: React.FC<ScheduleConsultationFormProps> = ({
  onSuccess,
  onCancel,
  preselectedPatientId,
  preselectedDate
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: preselectedPatientId || '',
      patientName: '',
      title: '',
      notes: '',
      date: preselectedDate || new Date(),
      time: '09:00',
      duration: 30,
      location: '',
      type: 'in-person',
      sendReminder: true,
    },
  });
  
  // Update patient name when patient ID changes
  React.useEffect(() => {
    const patientId = form.getValues('patientId');
    if (patientId) {
      const patient = mockPatients.find(p => p.id === patientId);
      if (patient) {
        form.setValue('patientName', patient.name);
      }
    }
  }, [form.watch('patientId')]);
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Format date and create appointment
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      
      // Create the appointment
      const result = await createAppointment({
        patientId: data.patientId,
        patientName: data.patientName,
        providerId: user.id,
        providerName: user.name,
        title: data.title,
        notes: data.notes || '',
        date: formattedDate,
        time: data.time,
        duration: data.duration,
        location: data.location,
        type: data.type,
        status: 'scheduled' as AppointmentStatus,
        reminder_sent: false,
      });
      
      if (result) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">{t('patientInformation')}</h3>
          
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('patientId')}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-3">{t('consultationDetails')}</h3>
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('consultationTitle')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Follow-up Appointment" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>{t('notes')}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special instructions or notes" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-3">{t('schedulingInformation')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('appointmentDate')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t('selectDate')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('appointmentTime')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectTime')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, hour) => {
                        return [
                          <SelectItem key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
                            {`${hour.toString().padStart(2, '0')}:00`}
                          </SelectItem>,
                          <SelectItem key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
                            {`${hour.toString().padStart(2, '0')}:30`}
                          </SelectItem>
                        ];
                      }).flat()}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>{t('duration')} ({t('minutes')})</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectDuration')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="15">15 {t('minutes')}</SelectItem>
                    <SelectItem value="30">30 {t('minutes')}</SelectItem>
                    <SelectItem value="45">45 {t('minutes')}</SelectItem>
                    <SelectItem value="60">60 {t('minutes')}</SelectItem>
                    <SelectItem value="90">90 {t('minutes')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>{t('consultationType')}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="in-person" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center">
                        <Building2 className="mr-2 h-4 w-4" />
                        {t('inPerson')}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="telemedicine" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center">
                        <Video className="mr-2 h-4 w-4" />
                        {t('telemedicine')}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="phone" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        {t('phone')}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>{t('location')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={
                      form.watch('type') === 'in-person' 
                        ? "Room 302, Building A" 
                        : form.watch('type') === 'telemedicine'
                          ? "Video call link will be sent"
                          : "Phone number will be called"
                    } 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sendReminder"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between mt-6 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{t('sendReminder')}</FormLabel>
                  <FormDescription>
                    {t('reminderDescription')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('cancel')}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '...' : t('scheduleConsultation')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleConsultationForm;

// Helper component
function FormDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
