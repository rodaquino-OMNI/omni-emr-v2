
export type FluidIntakeType = 
  | 'oral' 
  | 'iv' 
  | 'tube' 
  | 'other';

export type FluidOutputType = 
  | 'urine' 
  | 'vomit' 
  | 'drainage' 
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

export type FluidOutput = {
  id: string;
  patientId: string;
  timestamp: Date;
  amount: number; // in milliliters
  type: FluidOutputType;
  notes?: string;
  recordedBy: string;
};

export const fluidTypeLabels: Record<FluidIntakeType, { en: string; pt: string }> = {
  oral: { en: 'Oral Intake', pt: 'Ingestão Oral' },
  iv: { en: 'IV Fluids', pt: 'Fluidos IV' },
  tube: { en: 'Tube Feeding', pt: 'Alimentação por Sonda' },
  other: { en: 'Other', pt: 'Outro' },
};

export const fluidOutputLabels: Record<FluidOutputType, { en: string; pt: string }> = {
  urine: { en: 'Urine', pt: 'Urina' },
  vomit: { en: 'Vomit', pt: 'Vômito' },
  drainage: { en: 'Drainage', pt: 'Drenagem' },
  other: { en: 'Other', pt: 'Outro' },
};

export const defaultFluidTypes: FluidIntakeType[] = ['oral', 'iv', 'tube', 'other'];
export const defaultFluidOutputTypes: FluidOutputType[] = ['urine', 'vomit', 'drainage', 'other'];
