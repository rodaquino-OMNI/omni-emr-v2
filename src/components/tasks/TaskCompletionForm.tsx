
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Clock, ClipboardCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { completeTask } from '@/services/tasks';
import { Task } from '@/components/tasks/card/TaskCardTypes';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const completionFormSchema = z.object({
  notes: z.string().optional(),
});

type CompletionFormValues = z.infer<typeof completionFormSchema>;

interface TaskCompletionFormProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const TaskCompletionForm: React.FC<TaskCompletionFormProps> = ({
  task,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CompletionFormValues>({
    resolver: zodResolver(completionFormSchema),
    defaultValues: {
      notes: '',
    },
  });
  
  const onSubmit = async (data: CompletionFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to complete tasks",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await completeTask(
        task.id,
        user.id,
        user.name,
        data.notes || undefined
      );
      
      if (result) {
        toast({
          title: "Task completed",
          description: `Task "${task.title}" has been marked as complete`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        onOpenChange(false);
      } else {
        throw new Error("Failed to complete task");
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast({
        title: "Error",
        description: "Failed to mark the task as complete. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('completeTask')}</DialogTitle>
          <DialogDescription>
            {t('completeTaskDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 p-3 bg-muted rounded-md">
            <h3 className="font-medium">{task.title}</h3>
            <div className="text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {t('dueDate')}: {typeof task.dueDate === 'string' 
                    ? format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm') 
                    : format(task.dueDate, 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              <div className="mt-1">
                <span className="font-medium">{t('patient')}:</span> {task.patientName}
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('completionNotes')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder={t('enterCompletionNotes')}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  {t('cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gap-1"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  {isSubmitting ? t('completing') : t('completeTask')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCompletionForm;
