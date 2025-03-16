
export type Sector = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
};

export type SectorPatient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string | null;
  mrn: string;
  status: string;
  is_assigned: boolean;
  room_number?: string | null;
};
