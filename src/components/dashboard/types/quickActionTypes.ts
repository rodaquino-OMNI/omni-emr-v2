
import { ReactNode } from 'react';

export type QuickAction = {
  title: string;
  icon: ReactNode;
  link: string;
  color: string;
  permissionRequired?: string;
  roles?: string[]; // Specific roles that can see this action
}
