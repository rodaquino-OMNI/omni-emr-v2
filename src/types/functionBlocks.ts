
import { UserRole } from './auth';
import { LucideIcon } from 'lucide-react';

export interface FunctionBlock {
  id: string;
  name: string;
  description: string;
  category: FunctionBlockCategory;
  icon: string;
  permissions: string[];
  relatedPages: string[];
  isActive: boolean;
  availableForRoles: UserRole[];
  isSystemControlled?: boolean; // Indicates if this is a core function that can't be fully disabled
  requiredDependencies?: string[]; // IDs of other function blocks this one depends on
}

export type FunctionBlockCategory = 
  | 'clinical' 
  | 'medication' 
  | 'administrative' 
  | 'care' 
  | 'emergency' 
  | 'communication' 
  | 'workflow'
  | 'telemedicine'
  | 'laboratory'
  | 'radiology';

export interface FunctionBlockWithIcon extends FunctionBlock {
  iconComponent: LucideIcon;
}

export interface FunctionBlockMapping {
  pageRoute: string;
  requiredFunction: string;
  fallbackRoute?: string;
}

// Define a standard set of function block categories with descriptions
export const functionBlockCategories: Record<FunctionBlockCategory, string> = {
  clinical: 'Clinical documentation and patient assessment',
  medication: 'Medication management and administration',
  administrative: 'Administrative and system management',
  care: 'Patient care and monitoring',
  emergency: 'Emergency and urgent care',
  communication: 'Messaging and notifications',
  workflow: 'Clinical workflows and processes',
  telemedicine: 'Remote and virtual patient care',
  laboratory: 'Laboratory tests and results',
  radiology: 'Radiology studies and imaging'
};

// Define the interface for role-function assignment
export interface RoleFunctionAssignment {
  roleId: UserRole;
  functionBlockIds: string[];
}
