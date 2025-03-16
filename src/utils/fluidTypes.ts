
export type FluidIntakeType = 'water' | 'juice' | 'tea' | 'coffee' | 'milk' | 'soup' | 'other';
export type FluidOutputType = 'urine' | 'vomit' | 'drainage' | 'stool' | 'other';

export const defaultFluidTypes: FluidIntakeType[] = ['water', 'juice', 'tea', 'coffee', 'milk', 'soup', 'other'];
export const defaultFluidOutputTypes: FluidOutputType[] = ['urine', 'vomit', 'drainage', 'stool', 'other'];

type TranslationMap = {
  [key: string]: {
    en: string;
    pt: string;
  };
};

export const fluidTypeLabels: TranslationMap = {
  water: { en: 'Water', pt: 'Água' },
  juice: { en: 'Juice', pt: 'Suco' },
  tea: { en: 'Tea', pt: 'Chá' },
  coffee: { en: 'Coffee', pt: 'Café' },
  milk: { en: 'Milk', pt: 'Leite' },
  soup: { en: 'Soup', pt: 'Sopa' },
  other: { en: 'Other', pt: 'Outro' }
};

export const fluidOutputLabels: TranslationMap = {
  urine: { en: 'Urine', pt: 'Urina' },
  vomit: { en: 'Vomit', pt: 'Vômito' },
  drainage: { en: 'Drainage', pt: 'Drenagem' },
  stool: { en: 'Stool', pt: 'Fezes' },
  other: { en: 'Other', pt: 'Outro' }
};

export interface FluidIntake {
  id: string;
  patientId: string;
  type: FluidIntakeType;
  amount: number;
  timestamp: Date;
  notes?: string;
  recordedBy?: string;
}

export interface FluidOutput {
  id: string;
  patientId: string;
  type: FluidOutputType;
  amount: number;
  timestamp: Date;
  notes?: string;
  recordedBy?: string;
}
