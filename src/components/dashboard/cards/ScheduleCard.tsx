import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getAllAppointments } from '@/services/appointments/getAppointments';
import { Appointment } from '@/services/appointments/types';
import { useSectorContext } from '@/hooks/useSectorContext';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ScheduleCardProps {
  limit?: number;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ limit = 3 }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedSector } = useSectorContext();
  
  // Fetch upcoming appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['upcomingAppointments', limit],
    queryFn: async () => {
      const allAppointments = await getAllAppointments(20); // Fetch more than needed to filter
      
      // Filter for upcoming appointments
      const now = new Date();
      const upcomingAppointments = allAppointments.filter(appointment => {
        const appointmentDate = parseISO(`${appointment.date}T${appointment.time}`);
        return appointmentDate > now && appointment.status === 'scheduled';
      });
      
      // Sort by date and time
      upcomingAppointments.sort((a, b) => {
        const dateA = parseISO(`${a.date}T${a.time}`);
        const dateB = parseISO(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      // Return limited results
      return upcomingAppointments.slice(0, limit);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handleViewAll = () => {
    navigate('/schedule');
  };
  
  const getAppointmentDateLabel = (date: string) => {
    const appointmentDate = parseISO(date);
    if (isToday(appointmentDate)) {
      return t('today');
    } else if (isTomorrow(appointmentDate)) {
      return t('tomorrow');
    } else {
      return format(appointmentDate, 'MMM d, yyyy');
    }
  };
  
  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'telemedicine':
        return <Video className="h-3 w-3" />;
      default:
        return <MapPin className="h-3 w-3" />;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            {t('schedule')}
          </CardTitle>
          <CardDescription>
            {t('upcomingAppointments')}
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleViewAll}
          className="text-xs"
        >
          {t('viewAll')}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.length > 0 ? (
              appointments.map(appointment => (
                <div 
                  key={appointment.id} 
                  className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{appointment.patientName}</span>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      {getAppointmentTypeIcon(appointment.type)}
                      <span>{appointment.type}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{getAppointmentDateLabel(appointment.date)}</span>
                    <span className="mx-1">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{appointment.time}</span>
                    <span className="mx-1">•</span>
                    <span>{appointment.duration} min</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {t('with')}: {appointment.providerName}
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {t('noAppointmentsMessage', 'No upcoming appointments')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;