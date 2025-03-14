
import React from 'react';
import { cn } from '@/lib/utils';
import { AIInsight } from '../ai/AIInsights';
import { Patient } from './PatientCard';
import { Activity, AlertTriangle, Calendar, Pill, Clock, ListChecks, Info, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { samplePatients } from '@/data/samplePatients';
import VitalsChart from '../ui/VitalsChart';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';

type PatientOverviewProps = {
  patientId: string;
  insights?: AIInsight[];
  prescriptions?: any[];
  className?: string;
};

const PatientOverview = ({ patientId, insights = [], prescriptions = [], className }: PatientOverviewProps) => {
  const { user } = useAuth();
  const patient = samplePatients.find(p => p.id === patientId);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Health Status Summary */}
      <HealthStatusSummary patient={patient} />
      
      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VitalSignsCard patient={patient} />
        <MedicationsCard patient={patient} prescriptions={prescriptions} />
        <AppointmentsCard patient={patient} />
      </div>
      
      {/* Line of Care Visualization */}
      <CareTimelineCard patient={patient} />
      
      {/* Quick Actions */}
      <PatientQuickActions patient={patient} />
    </div>
  );
};

// Health Status Summary Component
const HealthStatusSummary = ({ patient }: { patient: Patient }) => {
  return (
    <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h2 className="text-lg font-semibold mb-3">Health Status Summary</h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">AI-Generated Summary</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {patient.gender === 'Male' ? 'Male' : 'Female'} patient, {patient.age} years old, with a diagnosis of {patient.diagnosis}. 
              Current status is {patient.status}. Patient was admitted for management of symptoms related to {patient.diagnosis}. 
              Treatment has been initiated and patient is responding as expected. Vital signs are stable.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="text-xs text-muted-foreground">Risk Score</div>
            <div className="text-lg font-semibold flex items-center gap-1 mt-1">
              <span className="text-amber-600">Medium</span>
              <span className="text-xs text-muted-foreground">↓ Decreasing</span>
            </div>
          </div>
          
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="text-xs text-muted-foreground">Functional Status</div>
            <div className="text-lg font-semibold flex items-center gap-1 mt-1">
              <span>Partially Independent</span>
            </div>
          </div>
          
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="text-xs text-muted-foreground">Pain Level</div>
            <div className="text-lg font-semibold flex items-center gap-1 mt-1">
              <span>3/10</span>
              <span className="text-xs text-green-600">↓ Improving</span>
            </div>
          </div>
          
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="text-xs text-muted-foreground">Treatment Phase</div>
            <div className="text-lg font-semibold flex items-center gap-1 mt-1">
              <span>Active Treatment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vital Signs Component
const VitalSignsCard = ({ patient }: { patient: Patient }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Vital Signs
          </CardTitle>
          <Link to={`/vitals?patientId=${patient.id}`} className="text-xs text-primary hover:underline">
            View History
          </Link>
        </div>
        <CardDescription>Last recorded 2 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Blood Pressure</div>
              <div className="text-lg font-semibold mt-1">120/80 mmHg</div>
              <div className="text-xs text-green-600">Normal</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Heart Rate</div>
              <div className="text-lg font-semibold mt-1">78 bpm</div>
              <div className="text-xs text-green-600">Normal</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Temperature</div>
              <div className="text-lg font-semibold mt-1">36.7 °C</div>
              <div className="text-xs text-green-600">Normal</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Oxygen Saturation</div>
              <div className="text-lg font-semibold mt-1">98%</div>
              <div className="text-xs text-green-600">Normal</div>
            </div>
          </div>
          
          <div className="h-40">
            <VitalsChart patientId={patient.id} type="heartRate" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Medications Component
const MedicationsCard = ({ patient, prescriptions }: { patient: Patient, prescriptions: any[] }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            Medications
          </CardTitle>
          <Link to={`/medications?patientId=${patient.id}`} className="text-xs text-primary hover:underline">
            View All
          </Link>
        </div>
        <CardDescription>Current medications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prescriptions && prescriptions.length > 0 ? (
            prescriptions.slice(0, 3).map((prescription, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                  <Pill className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">{prescription.name}</div>
                  <div className="text-xs text-muted-foreground">{prescription.dosage}</div>
                  <div className="text-xs text-blue-600 mt-1">Next dose: 2 hours</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No active medications
            </div>
          )}
          
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800 text-xs mt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Allergies:</span>
            </div>
            <div className="mt-1">Penicillin, Sulfa drugs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Appointments Component
const AppointmentsCard = ({ patient }: { patient: Patient }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Appointments
          </CardTitle>
          <Link to={`/schedule?patientId=${patient.id}`} className="text-xs text-primary hover:underline">
            View All
          </Link>
        </div>
        <CardDescription>Upcoming appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-2 rounded-md bg-green-50 border border-green-100">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-700">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium text-sm">Follow-up Consultation</div>
              <div className="text-xs text-muted-foreground">Dr. Sarah Johnson</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Today, 3:30 PM
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50">
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium text-sm">Physical Therapy</div>
              <div className="text-xs text-muted-foreground">Therapist Michael Brown</div>
              <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Tomorrow, 10:00 AM
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
              <ListChecks className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium text-sm">Lab Tests</div>
              <div className="text-xs text-muted-foreground">Blood work</div>
              <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                In 3 days
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Care Timeline Component
const CareTimelineCard = ({ patient }: { patient: Patient }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          Care Timeline
        </CardTitle>
        <CardDescription>Patient's care journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-indigo-200 pl-6 py-2 space-y-6">
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-indigo-600"></div>
            <div className="bg-indigo-50 p-3 rounded-md">
              <div className="text-sm font-medium">Hospital Admission</div>
              <div className="text-xs text-muted-foreground">7 days ago</div>
              <div className="text-xs mt-2">
                Initial presentation with symptoms of {patient.diagnosis}. Admitted for evaluation and treatment.
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-blue-600"></div>
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm font-medium">Treatment Initiated</div>
              <div className="text-xs text-muted-foreground">6 days ago</div>
              <div className="text-xs mt-2">
                Started on medication regimen. Initial response monitored.
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-green-600"></div>
            <div className="bg-green-50 p-3 rounded-md">
              <div className="text-sm font-medium">Condition Improving</div>
              <div className="text-xs text-muted-foreground">3 days ago</div>
              <div className="text-xs mt-2">
                Showing signs of improvement. Medication adjusted.
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-purple-600"></div>
            <div className="bg-purple-50 p-3 rounded-md">
              <div className="text-sm font-medium">Current Phase</div>
              <div className="text-xs text-muted-foreground">Today</div>
              <div className="text-xs mt-2">
                Continued treatment with monitoring. Preparing for discharge planning.
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-8 top-0 h-4 w-4 rounded-full bg-gray-300"></div>
            <div className="border border-dashed border-gray-300 p-3 rounded-md">
              <div className="text-sm font-medium text-muted-foreground">Planned Discharge</div>
              <div className="text-xs text-muted-foreground">In 3 days (estimated)</div>
              <div className="text-xs mt-2 text-muted-foreground">
                Expected discharge with follow-up care plan.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Patient Quick Actions Component
const PatientQuickActions = ({ patient }: { patient: Patient }) => {
  const { user } = useAuth();
  
  // Skip for patients
  if (user?.role === 'patient') return null;
  
  const actions = [
    {
      title: 'Add Prescription',
      icon: <Pill className="h-5 w-5" />,
      link: `/prescribe?patientId=${patient.id}`, // Fixed: changed from /prescribe/${patient.id} to use query param
      color: 'bg-blue-100 text-blue-800',
      roles: ['doctor', 'admin']
    },
    {
      title: 'Record Vital Signs',
      icon: <Activity className="h-5 w-5" />,
      link: `/vitals?patientId=${patient.id}`, // Fixed: changed from /vitals/new to /vitals
      color: 'bg-red-100 text-red-800',
      roles: ['doctor', 'nurse', 'admin']
    },
    {
      title: 'Add Clinical Note',
      icon: <FileText className="h-5 w-5" />,
      link: `/records?patientId=${patient.id}`, // Fixed: changed from /records/new to /records
      color: 'bg-green-100 text-green-800',
      roles: ['doctor', 'nurse', 'admin']
    },
    {
      title: 'Schedule Appointment',
      icon: <Calendar className="h-5 w-5" />,
      link: `/schedule?patientId=${patient.id}`, // Fixed: changed from /schedule/new to /schedule
      color: 'bg-purple-100 text-purple-800',
      roles: ['doctor', 'nurse', 'admin', 'administrative']
    }
  ];
  
  // Filter actions by user role
  const filteredActions = actions.filter(action => 
    !user || action.roles.includes(user.role)
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredActions.map((action, index) => (
            <Button 
              key={index} 
              variant="outline" 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${action.color}`}
              asChild
            >
              <Link to={action.link}>
                {action.icon}
                <span className="text-xs font-medium">{action.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientOverview;
