
import { commonTranslations } from './categories/common';
import { authTranslations } from './categories/auth';
import { patientsTranslations } from './categories/patients';
import { medicationsTranslations } from './categories/medications';
import { appointmentsTranslations } from './categories/appointments';
import { ordersTranslations } from './categories/orders';
import { tasksTranslations } from './categories/tasks';
import { telemedicineTranslations } from './categories/telemedicine';
import { vitalsTranslations } from './categories/vitals';
import { medicalHistoryTranslations } from './categories/medicalHistory';
import { usersTranslations } from './categories/users';
import { validationTranslations } from './categories/validations';
import { hospitalTranslations } from './categories/hospital';
import { emergencyTranslations } from './categories/emergency';
import { Translations } from '@/types/i18n';

export const translations: Translations = {
  en: {
    ...commonTranslations.en,
    ...authTranslations.en,
    ...patientsTranslations.en,
    ...medicationsTranslations.en,
    ...appointmentsTranslations.en,
    ...ordersTranslations.en,
    ...tasksTranslations.en,
    ...telemedicineTranslations.en,
    ...vitalsTranslations.en,
    ...medicalHistoryTranslations.en,
    ...usersTranslations.en,
    ...validationTranslations.en,
    ...hospitalTranslations.en,
    ...emergencyTranslations.en,
    
    // Sector selection
    selectSector: "Select Sector",
    selectSectorDescription: "Choose the hospital sector you want to work in",
    continue: "Continue",
    manageSectors: "Manage Sectors",
    availableSectors: "Available Sectors",
    noSectorsAvailable: "No sectors available",
    loading: "Loading...",
    criticalResults: "Critical Results",

    roleManagement: "Role Management",
    medicationAdministration: "Medication Administration",

    taskDetail: "Task Detail",
    visitNotes: "Visit Notes",
  },
  
  pt: {
    ...commonTranslations.pt,
    ...authTranslations.pt,
    ...patientsTranslations.pt,
    ...medicationsTranslations.pt,
    ...appointmentsTranslations.pt,
    ...ordersTranslations.pt,
    ...tasksTranslations.pt,
    ...telemedicineTranslations.pt,
    ...vitalsTranslations.pt,
    ...medicalHistoryTranslations.pt,
    ...usersTranslations.pt,
    ...validationTranslations.pt,
    ...hospitalTranslations.pt,
    ...emergencyTranslations.pt,
    
    // Sector selection
    selectSector: "Selecionar Setor",
    selectSectorDescription: "Escolha o setor hospitalar em que você deseja trabalhar",
    continue: "Continuar",
    manageSectors: "Gerenciar Setores",
    availableSectors: "Setores Disponíveis",
    noSectorsAvailable: "Nenhum setor disponível",
    loading: "Carregando...",
    criticalResults: "Resultados Críticos",

    roleManagement: "Gerenciamento de Funções",
    medicationAdministration: "Administração de Medicamentos",

    visitNotes: "Notas de Consulta",
    taskDetail: "Detalhes da Tarefa"
  }
};
