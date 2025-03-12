
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Patient } from './PatientCard';
import StatusBadge from '../ui/StatusBadge';
import VitalsChart from '../ui/VitalsChart';
import { PrescriptionsList } from '../prescriptions';
import { getPatientPrescriptions } from '../../services/prescriptionService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ChevronRight, CalendarDays, ClipboardList } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

type PatientDetailProps = {
  patientId: string;
  className?: string;
};

// Sample patient data
const samplePatients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    age: 65,
    gender: "Male",
    roomNumber: "203",
    status: "hospital",
    diagnosis: "Post-op recovery"
  },
  {
    id: "2",
    name: "Emma Thompson",
    age: 72,
    gender: "Female",
    status: "critical",
    roomNumber: "ICU-5",
    diagnosis: "Pneumonia"
  },
  {
    id: "3",
    name: "Michael Johnson",
    age: 58,
    gender: "Male",
    status: "home",
    diagnosis: "Chronic heart failure"
  },
  {
    id: "4",
    name: "Sophia Martinez",
    age: 45,
    gender: "Female",
    roomNumber: "105",
    status: "improving",
    diagnosis: "Diabetes management"
  },
  {
    id: "5",
    name: "Robert Chen",
    age: 68,
    gender: "Male",
    status: "stable",
    roomNumber: "218",
    diagnosis: "Hip replacement"
  },
  {
    id: "6",
    name: "Olivia Wilson",
    age: 83,
    gender: "Female",
    status: "home",
    diagnosis: "Rehabilitation"
  },
  {
    id: "7",
    name: "William Davis",
    age: 71,
    gender: "Male",
    status: "discharged",
    diagnosis: "Recovered"
  }
];

const PatientDetail = ({ patientId, className }: PatientDetailProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const patient = samplePatients.find(p => p.id === patientId);
  
  useEffect(() => {
    // Fetch patient prescriptions when the component mounts
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await getPatientPrescriptions(patientId);
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescriptions();
  }, [patientId]);
  
  if (!patient) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium text-muted-foreground">Patient not found</h2>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="h-20 w-20 rounded-full bg-medical-blue-light flex items-center justify-center text-medical-blue text-2xl font-semibold">
            {patient.name.charAt(0)}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl font-semibold">{patient.name}</h1>
              <StatusBadge status={patient.status} size="lg" />
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-muted-foreground">
              <div>{patient.age} years, {patient.gender}</div>
              {patient.roomNumber && <div>Room: {patient.roomNumber}</div>}
              <div>Diagnosis: {patient.diagnosis}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Link to={`/prescribe/${patientId}`}>
              <Button size="sm" className="flex items-center gap-1">
                <ClipboardList className="h-4 w-4" />
                Prescribe
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-medium mb-4">Vitals</h2>
            <VitalsChart patientId={patientId} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Recent Records</h2>
                <Link to="/records" className="text-sm text-primary hover:underline flex items-center">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 border border-border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-medical-green/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-medical-green" />
                    </div>
                    <div>
                      <div className="font-medium">Blood Test Results</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border border-border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-medical-green/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-medical-green" />
                    </div>
                    <div>
                      <div className="font-medium">Chest X-Ray Report</div>
                      <div className="text-xs text-muted-foreground">1 week ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Upcoming Appointments</h2>
                <Link to="/schedule" className="text-sm text-primary hover:underline flex items-center">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 border border-border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-medical-purple/10 flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 text-medical-purple" />
                    </div>
                    <div>
                      <div className="font-medium">Follow-up Consultation</div>
                      <div className="text-xs text-muted-foreground">Tomorrow, 10:30 AM</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border border-border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-medical-purple/10 flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 text-medical-purple" />
                    </div>
                    <div>
                      <div className="font-medium">Physical Therapy Session</div>
                      <div className="text-xs text-muted-foreground">Next Monday, 2:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Recent Prescriptions</h2>
              <Link to="/prescriptions" className="text-sm text-primary hover:underline flex items-center">
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <PrescriptionsList 
              prescriptions={prescriptions}
              patientId={patientId}
              limit={3}
              showAddNew={true}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="records" className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-medium mb-4">Medical Records</h2>
            {/* Records list component would go here */}
            <div className="text-center py-8 text-muted-foreground">
              Coming soon: Medical records for this patient
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Prescriptions</h2>
              
              <Link to={`/prescribe/${patientId}`}>
                <Button size="sm" className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4" />
                  New Prescription
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-muted-foreground">Loading prescriptions...</p>
              </div>
            ) : (
              <PrescriptionsList 
                prescriptions={prescriptions}
                patientId={patientId}
                showAddNew={false}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
