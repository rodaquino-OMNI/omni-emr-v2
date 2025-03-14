
import React from 'react';
import { Calendar, Activity, Clock, ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '../PatientCard';

type AppointmentsCardProps = {
  patient: Patient;
};

const AppointmentsCard = ({ patient }: AppointmentsCardProps) => {
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

export default AppointmentsCard;
