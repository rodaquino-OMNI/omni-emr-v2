
import React from 'react';
import { Pill, Microscope, ImageIcon, Stethoscope, UserPlus } from 'lucide-react';
import { OrderType } from '@/types/orders';

interface OrderTypeOption {
  value: OrderType;
  label: string;
  icon: React.ReactNode;
}

interface OrderTypeOptionsProps {
  language: string;
}

export const getOrderTypeOptions = ({ language }: OrderTypeOptionsProps): OrderTypeOption[] => {
  return [
    { value: 'medication', label: language === 'pt' ? 'Medicamento' : 'Medication', icon: <Pill className="h-4 w-4" /> },
    { value: 'laboratory', label: language === 'pt' ? 'Laboratório' : 'Laboratory', icon: <Microscope className="h-4 w-4" /> },
    { value: 'radiology', label: language === 'pt' ? 'Radiologia' : 'Radiology', icon: <ImageIcon className="h-4 w-4" /> },
    { value: 'procedure', label: language === 'pt' ? 'Procedimento' : 'Procedure', icon: <Stethoscope className="h-4 w-4" /> },
    { value: 'consultation', label: language === 'pt' ? 'Consulta' : 'Consultation', icon: <UserPlus className="h-4 w-4" /> }
  ];
};
