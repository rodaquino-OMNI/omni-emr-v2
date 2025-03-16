
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SectorPatient } from '@/types/sector';
import { useTranslation } from '@/hooks/useTranslation';
import { User, UserPlus, UserMinus, ArrowRight } from 'lucide-react';
import { useSectorContext } from '@/hooks/useSectorContext';
import StatusBadge from '@/components/ui/StatusBadge';
import TranslatedText from '@/components/common/TranslatedText';

type SectorPatientListProps = {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
  statusFilter?: string;
  searchTerm?: string;
};

const SectorPatientList = ({
  className,
  limit,
  showViewAll = false,
  statusFilter = 'all',
  searchTerm = ''
}: SectorPatientListProps) => {
  const { language } = useTranslation();
  const { 
    sectorPatients, 
    patientsLoading, 
    selectedSector,
    assignPatient,
    unassignPatient 
  } = useSectorContext();
  
  // Filter patients by searchTerm and statusFilter
  const filteredPatients = sectorPatients.filter(patient => {
    // Filter by status
    if (statusFilter !== 'all' && patient.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term (case insensitive)
    if (searchTerm && !`${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Limit the number of patients shown if requested
  const patients = limit ? filteredPatients.slice(0, limit) : filteredPatients;
  
  // Handle assignment toggle
  const toggleAssignment = async (patient: SectorPatient, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (patient.is_assigned) {
      await unassignPatient(patient.id);
    } else {
      await assignPatient(patient.id);
    }
  };
  
  if (patientsLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          <TranslatedText
            textKey="loadingPatients"
            fallback={language === 'pt' ? 'Carregando pacientes...' : 'Loading patients...'}
          />
        </p>
      </div>
    );
  }
  
  if (!selectedSector) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          <TranslatedText
            textKey="noSectorSelected"
            fallback={language === 'pt' ? 'Nenhum setor selecionado' : 'No sector selected'}
          />
        </p>
      </div>
    );
  }
  
  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          <TranslatedText
            textKey="noPatientFound"
            fallback={language === 'pt' ? 'Nenhum paciente encontrado' : 'No patients found'}
          />
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-1", className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {selectedSector.name} - 
          <span className="ml-2 text-muted-foreground">
            {filteredPatients.length} {language === 'pt' ? 'pacientes' : 'patients'}
          </span>
        </h2>
      </div>
      <div className="divide-y divide-border">
        {patients.map((patient) => (
          <Link 
            key={patient.id} 
            to={`/patients/${patient.id}`} 
            className="block py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md px-2 -mx-2"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={undefined} alt={`${patient.first_name} ${patient.last_name}`} />
                <AvatarFallback>{patient.first_name.substring(0, 1)}{patient.last_name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground flex items-center gap-2">
                  {patient.first_name} {patient.last_name}
                  {patient.is_assigned && (
                    <Badge variant="outline" className="ml-2 bg-primary/10">
                      <User className="h-3 w-3 mr-1" />
                      <TranslatedText
                        textKey="assigned"
                        fallback={language === 'pt' ? 'Atribuído' : 'Assigned'}
                      />
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                  <span>
                    {new Date(patient.date_of_birth).toLocaleDateString()} 
                    {patient.gender && `, ${patient.gender === 'male' ? (language === 'pt' ? 'Masculino' : 'Male') : (language === 'pt' ? 'Feminino' : 'Female')}`}
                  </span>
                  {patient.room_number && (
                    <span>• {language === 'pt' ? 'Quarto' : 'Room'} {patient.room_number}</span>
                  )}
                  <span>• MRN: {patient.mrn}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <StatusBadge status={patient.status as any} />
                
                <Button
                  size="icon"
                  variant={patient.is_assigned ? "destructive" : "default"}
                  className="h-8 w-8"
                  onClick={(e) => toggleAssignment(patient, e)}
                  title={patient.is_assigned ? 
                    (language === 'pt' ? 'Remover atribuição' : 'Unassign') : 
                    (language === 'pt' ? 'Atribuir a mim' : 'Assign to me')
                  }
                >
                  {patient.is_assigned ? (
                    <UserMinus className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {showViewAll && patients.length > 0 && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" asChild>
            <Link 
              to="/patients" 
              className="inline-flex items-center gap-1"
            >
              <TranslatedText
                textKey="viewAllPatients"
                fallback={language === 'pt' ? 'Ver todos os pacientes' : 'View all patients'}
              />
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectorPatientList;
