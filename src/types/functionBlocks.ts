
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
