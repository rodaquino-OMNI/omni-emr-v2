
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle, Clock, Package2, User, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getTaskById, updateTaskStatus } from '@/services/tasks';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch task data
  const { data: task, isLoading, isError } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id!),
    enabled: !!id,
  });
  
  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'pending' | 'completed' | 'cancelled' }) => 
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Task updated',
        description: 'The task status has been updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    },
  });
  
  // Handle status change
  const handleStatusChange = (status: 'pending' | 'completed' | 'cancelled') => {
    if (id) {
      updateTaskMutation.mutate({ id, status });
    }
  };
  
  // Format date
  const formatTaskDate = (date: string | Date) => {
    return format(new Date(date), 'PPpp');
  };
  
  // Get task icon based on type
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Package2 className="h-5 w-5" />;
      default:
        return <Package2 className="h-5 w-5" />;
    }
  };
  
  // Get priority badge style
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case 'urgent':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Check if task is delayed
  const isDelayed = task ? new Date(task.dueDate) < new Date() && task.status === 'pending' : false;
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
            <div className="max-w-3xl mx-auto w-full">
              <div>Loading...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError || !task) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
            <div className="max-w-3xl mx-auto w-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Task not found</h2>
                <p className="text-muted-foreground mb-4">
                  The task you're looking for doesn't exist or you don't have permission to view it.
                </p>
                <Button asChild>
                  <Link to="/tasks">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tasks
                  </Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-3xl mx-auto w-full">
            <div className="mb-6">
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link to="/tasks">
                  <ArrowLeft className="h-4 w-4" />
                  {t('back')}
                </Link>
              </Button>
            </div>
            
            <Card className={cn(
              "shadow-lg border-t-4",
              isDelayed ? "border-t-red-500" : "border-t-blue-500"
            )}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {getTaskIcon(task.type)}
                      {task.title}
                    </CardTitle>
                    <CardDescription>
                      {task.description || `Task ID: ${task.id}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {isDelayed && (
                  <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-red-700">This task is delayed. It was due on {formatTaskDate(task.dueDate)}.</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Task Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Patient:</span>{' '}
                          <Link to={`/patients/${task.patientId}`} className="text-primary hover:underline">
                            {task.patientName}
                          </Link>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Sector:</span>{' '}
                          {task.sector}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Due Date:</span>{' '}
                          <span className={isDelayed ? "text-red-600" : ""}>
                            {formatTaskDate(task.dueDate)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Created:</span>{' '}
                          {formatTaskDate(task.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Last Updated:</span>{' '}
                          {formatTaskDate(task.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        className="gap-1"
                        onClick={() => handleStatusChange('completed')}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Complete
                      </Button>
                    )}
                    
                    {task.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        className="gap-1"
                        onClick={() => handleStatusChange('pending')}
                      >
                        Reopen Task
                      </Button>
                    )}
                    
                    {task.status !== 'cancelled' && (
                      <Button 
                        variant="outline" 
                        className="gap-1 text-destructive"
                        onClick={() => handleStatusChange('cancelled')}
                      >
                        Cancel Task
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4 mt-4">
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link to="/tasks">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tasks
                  </Link>
                </Button>
                
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link to={`/patients/${task.patientId}`}>
                    View Patient
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetail;
