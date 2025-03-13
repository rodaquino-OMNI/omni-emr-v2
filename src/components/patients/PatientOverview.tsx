
import React from 'react';
import { Link } from 'react-router-dom';
import AIInsights from '../ai/AIInsights';
import { AIInsight } from '../ai/AIInsights';
import PatientVitals from './PatientVitals';
import { PrescriptionsList } from '../prescriptions';
import { FileText, ChevronRight, CalendarDays } from 'lucide-react';

type PatientOverviewProps = {
  patientId: string;
  insights: AIInsight[];
  prescriptions: any[];
};

const PatientOverview = ({ patientId, insights, prescriptions }: PatientOverviewProps) => {
  const nonCriticalInsights = insights.filter(i => i.type !== 'critical');
  
  return (
    <div className="space-y-6">
      {nonCriticalInsights.length > 0 && (
        <AIInsights 
          insights={nonCriticalInsights} 
          maxItems={3}
          compact
        />
      )}
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-medium mb-4">Vitals</h2>
        <PatientVitals patientId={patientId} />
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
    </div>
  );
};

export default PatientOverview;
