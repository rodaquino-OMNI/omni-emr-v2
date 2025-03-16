
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientContext } from '@/context/PatientContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  ClipboardList, 
  Check, 
  Clock, 
  AlertTriangle, 
  HeartPulse, 
  Thermometer, 
  Droplets,
  Pill
} from 'lucide-react';

// Task categories
type TaskCategory = 'vitals' | 'medications' | 'fluid' | 'all';

// Task status
type TaskStatus = 'pending' | 'completed' | 'overdue';

// Task interface
interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  dueAt: Date;
  status: TaskStatus;
  patientId: string;
  priority: 'low' | 'medium' | 'high';
  details?: string;
}

const NursePatientView: React.FC = () => {
  const { patient, isLoading } = usePatientContext();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('all');
  
  // Sample tasks (in a real app, these would come from an API)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Check vital signs',
      category: 'vitals',
      dueAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      status: 'pending',
      patientId: patient?.id || '',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Administer medication',
      category: 'medications',
      dueAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      status: 'pending',
      patientId: patient?.id || '',
      priority: 'high',
      details: 'Antibiotic IV, 500mg'
    },
    {
      id: '3',
      title: 'Record fluid intake',
      category: 'fluid',
      dueAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      status: 'overdue',
      patientId: patient?.id || '',
      priority: 'medium'
    }
  ]);
  
  // Filter tasks by selected category
  const filteredTasks = tasks.filter(task => 
    activeCategory === 'all' || task.category === activeCategory
  );
  
  // Mark task as completed
  const completeTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as TaskStatus } 
        : task
    ));
  };
  
  // Get counts by status
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const overdueCount = tasks.filter(task => task.status === 'overdue').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  
  if (isLoading) {
    return <div>Loading patient data...</div>;
  }
  
  if (!patient) {
    return <div>No patient data available</div>;
  }
  
  // Render category icon
  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'vitals':
        return <HeartPulse className="h-5 w-5" />;
      case 'medications':
        return <Pill className="h-5 w-5" />;
      case 'fluid':
        return <Droplets className="h-5 w-5" />;
      default:
        return <ClipboardList className="h-5 w-5" />;
    }
  };
  
  // Render status badge
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <Check className="h-3.5 w-3.5 mr-1" />
            Completed
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Task stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold">{overdueCount}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold">{completedCount}</p>
              </div>
              <Check className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Task categories */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger 
                value="all" 
                onClick={() => setActiveCategory('all')}
                className={activeCategory === 'all' ? 'data-[state=active]' : ''}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                All
              </TabsTrigger>
              <TabsTrigger 
                value="vitals" 
                onClick={() => setActiveCategory('vitals')}
                className={activeCategory === 'vitals' ? 'data-[state=active]' : ''}
              >
                <HeartPulse className="h-4 w-4 mr-2" />
                Vitals
              </TabsTrigger>
              <TabsTrigger 
                value="medications" 
                onClick={() => setActiveCategory('medications')}
                className={activeCategory === 'medications' ? 'data-[state=active]' : ''}
              >
                <Pill className="h-4 w-4 mr-2" />
                Meds
              </TabsTrigger>
              <TabsTrigger 
                value="fluid" 
                onClick={() => setActiveCategory('fluid')}
                className={activeCategory === 'fluid' ? 'data-[state=active]' : ''}
              >
                <Droplets className="h-4 w-4 mr-2" />
                Fluid
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Tasks list */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No tasks in this category
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`p-4 border rounded-md ${
                    task.status === 'overdue' 
                      ? 'border-red-200 bg-red-50' 
                      : task.status === 'completed'
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(task.category)}
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          Due: {task.dueAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {getStatusBadge(task.status)}
                      {task.status !== 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => completeTask(task.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                  {task.details && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {task.details}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Data entry sections */}
      <Tabs defaultValue="vitals">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="vitals">
            <HeartPulse className="h-4 w-4 mr-2" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="fluid">
            <Droplets className="h-4 w-4 mr-2" />
            Fluid Balance
          </TabsTrigger>
          <TabsTrigger value="medications">
            <Pill className="h-4 w-4 mr-2" />
            Medication Check
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Sample form fields - would be integrated with a form library in production */}
                <div className="space-y-2">
                  <label htmlFor="temperature" className="text-sm font-medium">Temperature (°C)</label>
                  <input 
                    type="number" 
                    id="temperature" 
                    step="0.1"
                    className="w-full p-2 border rounded-md" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="heart-rate" className="text-sm font-medium">Heart Rate (bpm)</label>
                  <input 
                    type="number" 
                    id="heart-rate" 
                    className="w-full p-2 border rounded-md" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bp-systolic" className="text-sm font-medium">Blood Pressure (Systolic)</label>
                  <input 
                    type="number" 
                    id="bp-systolic" 
                    className="w-full p-2 border rounded-md" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bp-diastolic" className="text-sm font-medium">Blood Pressure (Diastolic)</label>
                  <input 
                    type="number" 
                    id="bp-diastolic" 
                    className="w-full p-2 border rounded-md" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="respiratory-rate" className="text-sm font-medium">Respiratory Rate</label>
                  <input 
                    type="number" 
                    id="respiratory-rate" 
                    className="w-full p-2 border rounded-md" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="oxygen" className="text-sm font-medium">Oxygen Saturation (%)</label>
                  <input 
                    type="number" 
                    id="oxygen" 
                    className="w-full p-2 border rounded-md" 
                  />
                </div>
              </div>
              <Button className="mt-4 w-full">Save Vital Signs</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fluid" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fluid Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="intake">
                <TabsList className="w-full">
                  <TabsTrigger value="intake" className="flex-1">Intake</TabsTrigger>
                  <TabsTrigger value="output" className="flex-1">Output</TabsTrigger>
                </TabsList>
                
                <TabsContent value="intake" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="intake-type" className="text-sm font-medium">Type</label>
                    <select id="intake-type" className="w-full p-2 border rounded-md">
                      <option value="oral">Oral</option>
                      <option value="iv">IV Fluid</option>
                      <option value="ng">NG Tube</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="intake-amount" className="text-sm font-medium">Amount (ml)</label>
                    <input 
                      type="number" 
                      id="intake-amount" 
                      className="w-full p-2 border rounded-md" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="intake-notes" className="text-sm font-medium">Notes</label>
                    <textarea 
                      id="intake-notes" 
                      className="w-full p-2 border rounded-md" 
                      rows={3}
                    ></textarea>
                  </div>
                  <Button className="w-full">Record Intake</Button>
                </TabsContent>
                
                <TabsContent value="output" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="output-type" className="text-sm font-medium">Type</label>
                    <select id="output-type" className="w-full p-2 border rounded-md">
                      <option value="urine">Urine</option>
                      <option value="vomit">Vomit</option>
                      <option value="drain">Drain</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="output-amount" className="text-sm font-medium">Amount (ml)</label>
                    <input 
                      type="number" 
                      id="output-amount" 
                      className="w-full p-2 border rounded-md" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="output-notes" className="text-sm font-medium">Notes</label>
                    <textarea 
                      id="output-notes" 
                      className="w-full p-2 border rounded-md" 
                      rows={3}
                    ></textarea>
                  </div>
                  <Button className="w-full">Record Output</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medication Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                  Please scan medication barcode or verify medication details before administration
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="medication" className="text-sm font-medium">Medication</label>
                  <select id="medication" className="w-full p-2 border rounded-md">
                    <option value="">Select medication...</option>
                    <option value="med1">Acetaminophen 500mg Tab</option>
                    <option value="med2">Loratadine 10mg Tab</option>
                    <option value="med3">Amoxicillin 500mg Cap</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="dosage" className="text-sm font-medium">Dosage</label>
                  <input 
                    type="text" 
                    id="dosage" 
                    className="w-full p-2 border rounded-md" 
                    placeholder="e.g., 1 tablet"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="route" className="text-sm font-medium">Route</label>
                  <select id="route" className="w-full p-2 border rounded-md">
                    <option value="oral">Oral</option>
                    <option value="iv">IV</option>
                    <option value="im">IM</option>
                    <option value="sc">SC</option>
                    <option value="topical">Topical</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="admin-notes" className="text-sm font-medium">Administration Notes</label>
                  <textarea 
                    id="admin-notes" 
                    className="w-full p-2 border rounded-md" 
                    rows={3}
                    placeholder="Enter any observations or patient response"
                  ></textarea>
                </div>
                
                <Button className="w-full">Record Administration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NursePatientView;
