
import { ReactNode } from 'react';

export interface SectorType {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export interface SectorPatient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string | null;
  mrn: string;
  status: string;
  is_assigned: boolean;
  room_number?: string | null;
}

export interface SectorContextType {
  sectors: SectorType[];
  selectedSector: SectorType | null;
  selectSector: (sector: SectorType) => void;
  isLoading: boolean;
  error: string | null;
  fetchSectors: () => Promise<void>;
  isCacheStale: boolean;
  sectorPatients: SectorPatient[];
  patientsLoading: boolean;
  refreshPatients: () => Promise<void>;
  assignPatient: (patientId: string) => Promise<void>;
  unassignPatient: (patientId: string) => Promise<void>;
}

export interface SectorProviderProps {
  children: ReactNode;
}
