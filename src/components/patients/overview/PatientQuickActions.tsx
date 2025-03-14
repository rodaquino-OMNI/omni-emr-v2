
import React from 'react';
import { Pill, Activity, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Patient } from '../PatientCard';

type PatientQuickActionsProps = {
  patient: Patient;
};

const PatientQuickActions = ({ patient }: PatientQuickActionsProps) => {
  const { user } = useAuth();
  
  // Skip for patients
  if (user?.role === 'patient') return null;
  
  const actions = [
    {
      title: 'Add Prescription',
      icon: <Pill className="h-5 w-5" />,
      link: `/prescribe?patientId=${patient.id}`,
      color: 'bg-blue-100 text-blue-800',
      roles: ['doctor', 'admin']
    },
    {
      title: 'Record Vital Signs',
      icon: <Activity className="h-5 w-5" />,
      link: `/vitals?patientId=${patient.id}`,
      color: 'bg-red-100 text-red-800',
      roles: ['doctor', 'nurse', 'admin']
    },
    {
      title: 'Add Clinical Note',
      icon: <FileText className="h-5 w-5" />,
      link: `/records?patientId=${patient.id}`,
      color: 'bg-green-100 text-green-800',
      roles: ['doctor', 'nurse', 'admin']
    },
    {
      title: 'Schedule Appointment',
      icon: <Calendar className="h-5 w-5" />,
      link: `/schedule?patientId=${patient.id}`,
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

export default PatientQuickActions;
