
import { authTranslations } from './categories/auth';
import { commonTranslations } from './categories/common';
import { medicalHistoryTranslations } from './categories/medicalHistory';
import { medicationsTranslations } from './categories/medications';
import { ordersTranslations } from './categories/orders';
import { patientsTranslations } from './categories/patients';
import { validationTranslations } from './categories/validations';
import { tasksTranslations } from './categories/tasks';
import { appointmentsTranslations } from './categories/appointments';
import { usersTranslations } from './categories/users';
import { emergencyTranslations } from './categories/emergency';
import { hospitalTranslations } from './categories/hospital';
import { telemedicineTranslations } from './categories/telemedicine';
import { vitalsTranslations } from './categories/vitals';

// All translations in one object
export const translations = {
  en: {
    ...authTranslations.en,
    ...commonTranslations.en,
    ...medicalHistoryTranslations.en,
    ...medicationsTranslations.en,
    ...ordersTranslations.en,
    ...patientsTranslations.en,
    ...validationTranslations.en,
    ...vitalsTranslations.en,
    ...tasksTranslations.en,
    ...appointmentsTranslations.en,
    ...usersTranslations.en,
    ...emergencyTranslations.en,
    ...hospitalTranslations.en,
    ...telemedicineTranslations.en,
    
    // Visit Notes and Discharge related translations
    visitNotes: 'Visit Notes',
    discharge: 'Discharge',
    dischargePatient: 'Discharge Patient',
    dischargeNotes: 'Discharge Notes',
    dischargeInstructions: 'Discharge Instructions',
    dischargeDate: 'Discharge Date',
    
    // Connection and offline mode
    connectionLost: 'Connection lost',
    connectionRestored: 'Connection restored',
    workingOffline: 'Working in offline mode. Some features may be unavailable.',
    allFeaturesAvailable: 'All features are available again.',
    offlineMode: 'Offline mode',
    offlineModeEnabled: 'Offline mode enabled',
    limitedFunctionality: 'Working with limited functionality due to connection issues.',
    offlineNavigation: 'Working with limited functionality. Some features require a server connection.',
    offlineNavigationAvailable: 'Navigation is available in offline mode.',
    continueToDashboard: 'Continue to Dashboard',
  },
  pt: {
    ...authTranslations.pt,
    ...commonTranslations.pt,
    ...medicalHistoryTranslations.pt,
    ...medicationsTranslations.pt,
    ...ordersTranslations.pt,
    ...patientsTranslations.pt,
    ...validationTranslations.pt,
    ...vitalsTranslations.pt,
    ...tasksTranslations.pt,
    ...appointmentsTranslations.pt,
    ...usersTranslations.pt,
    ...emergencyTranslations.pt,
    ...hospitalTranslations.pt,
    ...telemedicineTranslations.pt,
    
    // Visit Notes and Discharge related translations
    visitNotes: 'Notas de Visita',
    discharge: 'Alta',
    dischargePatient: 'Alta do Paciente',
    dischargeNotes: 'Notas de Alta',
    dischargeInstructions: 'Instruções de Alta',
    dischargeDate: 'Data da Alta',
    
    // Connection and offline mode
    connectionLost: 'Conexão perdida',
    connectionRestored: 'Conexão restaurada',
    workingOffline: 'Funcionando em modo offline. Algumas funcionalidades podem estar indisponíveis.',
    allFeaturesAvailable: 'Todas as funcionalidades estão disponíveis novamente.',
    offlineMode: 'Modo offline',
    offlineModeEnabled: 'Modo offline ativado',
    limitedFunctionality: 'Funcionando com funcionalidades limitadas devido a problemas de conexão.',
    offlineNavigation: 'Funcionando com funcionalidades limitadas. Alguns recursos requerem conexão com o servidor.',
    offlineNavigationAvailable: 'Navegação disponível no modo offline.',
    continueToDashboard: 'Continuar para o Dashboard',
  }
};

// Type for translation keys
export type TranslationKey = keyof typeof translations.en;
