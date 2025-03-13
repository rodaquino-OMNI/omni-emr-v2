
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Clock, Building2, Phone, Video, Bell } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ConsultationFormValues } from './types';
import { cn } from '@/lib/utils';

interface SchedulingSectionProps {
  form: UseFormReturn<ConsultationFormValues>;
}

const SchedulingSection: React.FC<SchedulingSectionProps> = ({ form }) => {
  const { t } = useTranslation();
  
  return (
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
  );
};

export default SchedulingSection;
