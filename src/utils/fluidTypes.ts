
export type FluidIntakeType = 
  | 'oral' 
  | 'iv' 
  | 'tube' 
  | 'other';

export type FluidIntake = {
  id: string;
  patientId: string;
  timestamp: Date;
  amount: number; // in milliliters
  type: FluidIntakeType;
  notes?: string;
  recordedBy: string;
};

export const fluidTypeLabels: Record<FluidIntakeType, { en: string; pt: string }> = {
  oral: { en: 'Oral Intake', pt: 'Ingestão Oral' },
  iv: { en: 'IV Fluids', pt: 'Fluidos IV' },
  tube: { en: 'Tube Feeding', pt: 'Alimentação por Sonda' },
  other: { en: 'Other', pt: 'Outro' },
};

export const defaultFluidTypes: FluidIntakeType[] = ['oral', 'iv', 'tube', 'other'];
