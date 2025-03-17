
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock } from 'lucide-react';

interface Appointment {
  id: string;
  patient_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time?: string;
  type: string;
  status: string;
  provider_id?: string;
  provider_name?: string;
  location?: string;
  notes?: string;
  created_at: string;
}

interface PatientAppointmentsTabProps extends PatientTabProps {
  compact?: boolean;
}

const PatientAppointmentsTab: React.FC<PatientAppointmentsTabProps> = ({ patientId, compact = false }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', patientId)
          .order('date', { ascending: true });
          
        if (error) throw error;
        
        setAppointments(data || []);
      } catch (err: any) {
        console.error("Error fetching appointments:", err);
        setError(err.message || "Failed to load appointments");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [patientId]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading appointments: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            No appointments scheduled for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Split appointments into upcoming and past
  const now = new Date();
  const upcoming = appointments.filter(apt => 
    new Date(`${apt.date}T${apt.start_time}`) > now
  );
  const past = appointments.filter(apt => 
    new Date(`${apt.date}T${apt.start_time}`) <= now
  );
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'no_show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return time;
    }
  };
  
  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.slice(0, 3).map((apt) => (
                <div key={apt.id} className="border-b pb-2 last:border-0 last:pb-0">
                  <div className="font-medium">{apt.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(apt.date).toLocaleDateString()}
                    <span className="mx-1">•</span>
                    <Clock className="h-3 w-3" />
                    {formatTime(apt.start_time)}
                  </div>
                </div>
              ))}
              {upcoming.length > 3 && (
                <div className="text-sm text-muted-foreground text-center">
                  + {upcoming.length - 3} more upcoming appointments
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcoming.map((apt) => (
                <div key={apt.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="font-medium">{apt.title}</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                      {apt.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(apt.date).toLocaleDateString()}
                    <span className="mx-1">•</span>
                    <Clock className="h-3 w-3" />
                    {formatTime(apt.start_time)}
                    {apt.end_time && ` - ${formatTime(apt.end_time)}`}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span> {apt.type.replace(/_/g, ' ')}
                    </div>
                    {apt.provider_name && (
                      <div>
                        <span className="text-muted-foreground">Provider:</span> {apt.provider_name}
                      </div>
                    )}
                    {apt.location && (
                      <div>
                        <span className="text-muted-foreground">Location:</span> {apt.location}
                      </div>
                    )}
                  </div>
                  
                  {apt.notes && (
                    <div className="text-sm mt-2">
                      <span className="text-muted-foreground">Notes:</span> {apt.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {past.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Past Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {past.slice(0, 5).map((apt) => (
                <div key={apt.id} className="border-b pb-3 last:border-0 last:pb-0 opacity-75">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="font-medium">{apt.title}</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                      {apt.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(apt.date).toLocaleDateString()}
                      <span className="mx-1">•</span>
                      <Clock className="h-3 w-3" />
                      {formatTime(apt.start_time)}
                      {apt.end_time && ` - ${formatTime(apt.end_time)}`}
                    </div>
                    
                    <div className="mt-1">
                      {apt.type.replace(/_/g, ' ')}
                      {apt.provider_name && ` • Provider: ${apt.provider_name}`}
                    </div>
                  </div>
                </div>
              ))}
              {past.length > 5 && (
                <div className="text-sm text-muted-foreground text-center">
                  + {past.length - 5} more past appointments
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientAppointmentsTab;
