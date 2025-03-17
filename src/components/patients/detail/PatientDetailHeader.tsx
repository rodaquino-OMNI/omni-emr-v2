
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
  onAssignmentToggle?: () => Promise<void>;
};

const PatientDetailHeader = ({ patient, hasCriticalInsights = false, className, onAssignmentToggle }: PatientDetailHeaderProps) => {
  const navigate = useNavigate();

  // Create a type-safe way to handle either a string ID or a Patient object
  const patientId = typeof patient === 'string' ? patient : patient.id;
  const patientName = typeof patient === 'string' ? 'Loading...' : patient.name || `${patient.first_name} ${patient.last_name}`;
  const patientMRN = typeof patient === 'string' ? 'Loading...' : patient.mrn;

  // Handle navigation to profile safely
  const handleNavigateToProfile = () => {
    navigate(`/patients/${patientId}/profile`);
  };

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
            MRN: {patientMRN}
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
          <DropdownMenuItem onClick={handleNavigateToProfile}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          {onAssignmentToggle && (
            <DropdownMenuItem onClick={onAssignmentToggle}>
              <span>{typeof patient !== 'string' && patient.is_assigned ? 'Unassign Patient' : 'Assign Patient'}</span>
            </DropdownMenuItem>
          )}
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
