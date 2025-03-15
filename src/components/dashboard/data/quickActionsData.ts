
import { Pill, Calendar, FileText, MessageSquare, Video, Users, ClipboardList, Activity, Droplet, ClipboardCheck, Syringe, FlaskConical } from 'lucide-react';
import { QuickAction } from '../types/quickActionTypes';
import React from 'react';

// Define icons outside of the data array to avoid JSX in .ts file
const createIconProps = () => ({ className: "h-5 w-5" });

export const getQuickActions = (language: string): QuickAction[] => [
  // Nurse primary actions
  {
    title: language === 'pt' ? 'Administrar Medicação' : 'Administer Medication',
    icon: React.createElement(Pill, createIconProps()),
    link: '/medications',
    color: 'bg-green-100 text-green-800',
    permissionRequired: 'administer_medications',
    roles: ['nurse', 'doctor']
  },
  {
    title: language === 'pt' ? 'Balanço Hídrico' : 'Fluid Balance',
    icon: React.createElement(Droplet, createIconProps()),
    link: '/fluid-balance',
    color: 'bg-blue-100 text-blue-800',
    permissionRequired: 'manage_fluid_balance',
    roles: ['nurse', 'doctor']
  },
  {
    title: language === 'pt' ? 'Notas de Visita' : 'Visit Notes',
    icon: React.createElement(ClipboardCheck, createIconProps()),
    link: '/visit-notes',
    color: 'bg-amber-100 text-amber-800',
    permissionRequired: 'view_records',
    roles: ['nurse', 'doctor']
  },
  {
    title: language === 'pt' ? 'Registrar Sinais Vitais' : 'Record Vital Signs',
    icon: React.createElement(Activity, createIconProps()),
    link: '/vitals',
    color: 'bg-red-100 text-red-800',
    permissionRequired: 'document_vital_signs',
    roles: ['nurse', 'doctor']
  },
  
  // Doctor primary actions
  {
    title: language === 'pt' ? 'Nova Consulta' : 'New Consultation',
    icon: React.createElement(Calendar, createIconProps()),
    link: '/schedule',
    color: 'bg-indigo-100 text-indigo-800',
    permissionRequired: 'schedule_appointments',
    roles: ['doctor', 'administrative']
  },
  {
    title: language === 'pt' ? 'Nova Prescrição' : 'New Prescription',
    icon: React.createElement(Pill, createIconProps()),
    link: '/prescribe',
    color: 'bg-blue-100 text-blue-800',
    permissionRequired: 'prescribe_medications',
    roles: ['doctor']
  },
  {
    title: language === 'pt' ? 'Registros do Paciente' : 'Patient Records',
    icon: React.createElement(FileText, createIconProps()),
    link: '/records',
    color: 'bg-purple-100 text-purple-800',
    permissionRequired: 'view_records',
    roles: ['doctor', 'nurse', 'administrative']
  },
  {
    title: language === 'pt' ? 'Telemedicina' : 'Telemedicine',
    icon: React.createElement(Video, createIconProps()),
    link: '/telemedicine',
    color: 'bg-violet-100 text-violet-800',
    permissionRequired: 'telemedicine',
    roles: ['doctor']
  },
  
  // Administrative staff actions
  {
    title: language === 'pt' ? 'Agendar Consulta' : 'Schedule Appointment',
    icon: React.createElement(Calendar, createIconProps()),
    link: '/schedule',
    color: 'bg-emerald-100 text-emerald-800',
    permissionRequired: 'schedule_appointments',
    roles: ['administrative', 'doctor']
  },
  {
    title: language === 'pt' ? 'Gerenciar Pacientes' : 'Manage Patients',
    icon: React.createElement(Users, createIconProps()),
    link: '/patients',
    color: 'bg-sky-100 text-sky-800',
    roles: ['administrative', 'doctor', 'nurse']
  },
  
  // Lab technician actions
  {
    title: language === 'pt' ? 'Resultados de Laboratório' : 'Lab Results',
    icon: React.createElement(FlaskConical, createIconProps()),
    link: '/orders',
    color: 'bg-fuchsia-100 text-fuchsia-800',
    permissionRequired: 'view_lab_results',
    roles: ['lab_technician', 'doctor']
  },
  
  // Pharmacist actions
  {
    title: language === 'pt' ? 'Verificar Prescrições' : 'Verify Prescriptions',
    icon: React.createElement(ClipboardList, createIconProps()),
    link: '/prescriptions',
    color: 'bg-lime-100 text-lime-800',
    permissionRequired: 'verify_prescriptions',
    roles: ['pharmacist']
  },
  
  // Patient actions
  {
    title: language === 'pt' ? 'Minhas Mensagens' : 'My Messages',
    icon: React.createElement(MessageSquare, createIconProps()),
    link: '/messages',
    color: 'bg-green-100 text-green-800',
    permissionRequired: 'message_care_team',
    roles: ['patient']
  },
  {
    title: language === 'pt' ? 'Meus Medicamentos' : 'My Medications',
    icon: React.createElement(Pill, createIconProps()),
    link: '/medications',
    color: 'bg-purple-100 text-purple-800',
    permissionRequired: 'view_own_medications',
    roles: ['patient']
  },
  {
    title: language === 'pt' ? 'Meus Registros' : 'My Records',
    icon: React.createElement(FileText, createIconProps()),
    link: '/records',
    color: 'bg-indigo-100 text-indigo-800',
    permissionRequired: 'view_own_records',
    roles: ['patient']
  },
  {
    title: language === 'pt' ? 'Agendar Consulta' : 'Schedule Appointment',
    icon: React.createElement(Calendar, createIconProps()),
    link: '/schedule',
    color: 'bg-teal-100 text-teal-800',
    permissionRequired: 'schedule_own_appointments',
    roles: ['patient']
  }
];
