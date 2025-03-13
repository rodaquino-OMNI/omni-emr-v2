
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { AppointmentType, createAppointment } from '@/services/appointmentService';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Define the consultation form schema
const consultationFormSchema = z.object({
  patientId: z.string().min(1, { message: 'Patient is required' }),
  patientName: z.string().min(1, { message: 'Patient name is required' }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  notes: z.string().optional(),
  date: z.date({ required_error: 'Appointment date is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  duration: z.number().min(5, { message: 'Duration must be at least 5 minutes' }).default(30),
  location: z.string().min(1, { message: 'Location is required' }),
  type: z.enum(['in-person', 'telemedicine', 'phone'], { 
    required_error: 'Consultation type is required' 
  }),
  sendReminder: z.boolean().default(true),
});

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

interface ScheduleConsultationFormProps {
  patientId?: string;
  patientName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ScheduleConsultationForm: React.FC<ScheduleConsultationFormProps> = ({
  patientId,
  patientName,
  onSuccess,
  onCancel
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Set up the form with default values
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      patientId: patientId || '',
      patientName: patientName || '',
      title: '',
      notes: '',
      date: undefined,
      time: '',
      duration: 30,
      location: '',
      type: 'in-person',
      sendReminder: true,
    },
  });
  
  // Generate time slots from 8 AM to 6 PM in 15-minute intervals
  const timeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        const display = `${hour > 12 ? hour - 12 : hour}:${formattedMinute} ${hour >= 12 ? 'PM' : 'AM'}`;
        slots.push({ value: time, display });
      }
    }
    return slots;
  };
  
  // Handle form submission
  const onSubmit = async (data: ConsultationFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to schedule consultations",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Format the date to ISO string (YYYY-MM-DD)
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      
      const appointmentData = {
        patientId: data.patientId,
        patientName: data.patientName,
        providerId: user.id,
        providerName: user.name,
        title: data.title,
        notes: data.notes,
        date: formattedDate,
        time: data.time,
        duration: data.duration,
        location: data.type === 'telemedicine' ? 'Virtual' : 
                 data.type === 'phone' ? 'Phone' : data.location,
        type: data.type as AppointmentType,
        status: 'scheduled',
        reminder_sent: false,
      };
      
      const result = await createAppointment(appointmentData);
      
      toast({
        title: "Consultation scheduled",
        description: `Appointment booked for ${format(data.date, 'MMMM dd, yyyy')} at ${data.time}`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to schedule consultation:', error);
      toast({
        title: "Error",
        description: "Failed to schedule the consultation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('patientInformation')}</h3>
            
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('patientId')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!patientId} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('patientName')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!patientName} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Consultation Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('consultationDetails')}</h3>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('consultationTitle')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g., Annual Check-up" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('notes')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter any relevant notes or patient concerns" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Scheduling Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('schedulingInformation')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            format(field.value, "MMMM dd, yyyy")
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
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
                      {timeSlots().map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
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
                <FormItem className="space-y-3">
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
                        <FormLabel className="font-normal">
                          {t('inPerson')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="telemedicine" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('telemedicine')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="phone" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('phone')}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Display location field only for in-person consultations */}
          {form.watch('type') === 'in-person' && (
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('location')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g., Room 203" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="sendReminder"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                <FormControl>
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t('sendReminder')}
                  </FormLabel>
                  <FormDescription>
                    {t('reminderDescription')}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('cancel')}
            </Button>
          )}
          <Button type="submit">
            {t('scheduleConsultation')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleConsultationForm;
