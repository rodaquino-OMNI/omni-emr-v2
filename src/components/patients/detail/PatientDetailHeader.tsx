import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Patient } from '@/types/patient';

type PatientDetailHeaderProps = {
  patient: Patient | string;
  hasCriticalInsights?: boolean;
  className?: string;
};

const PatientDetailHeader = ({ patient, hasCriticalInsights = false, className }: PatientDetailHeaderProps) => {
  const navigate = useNavigate();

  // Update the problematic function call or use a type assertion
  // Find the line with the error and update to:
  const patientObj = typeof patient === 'string' ? { id: patient } as any : patient;

  // Or adapt the function to accept either a string or a Patient object:
  const handleNavigateToProfile = (patientData: string | Patient) => {
    const patientId = typeof patientData === 'string' ? patientData : patientData.id;
    navigate(`/patients/${patientId}/profile`);
  };

  const patientName = typeof patient === 'string' ? 'Loading...' : patient.name;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${patientName}`} />
          <AvatarFallback>{patientName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{patientName}</h1>
          <p className="text-muted-foreground">
            MRN: {typeof patient === 'string' ? 'Loading...' : patient.mrn}
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open user menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleNavigateToProfile(patient)}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            {hasCriticalInsights ? 'Resolve Insights' : 'View Insights'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PatientDetailHeader;
