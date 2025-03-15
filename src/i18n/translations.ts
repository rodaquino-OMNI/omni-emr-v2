
import { auth } from './categories/auth';
import { common } from './categories/common';
import { medicalHistory } from './categories/medicalHistory';
import { medications } from './categories/medications';
import { orders } from './categories/orders';
import { patients } from './categories/patients';
import { validations } from './categories/validations';
import { vitals } from './categories/vitals';
import { tasks } from './categories/tasks';
import { appointments } from './categories/appointments';
import { users } from './categories/users';
import { emergency } from './categories/emergency';
import { hospital } from './categories/hospital';
import { telemedicine } from './categories/telemedicine';

// All translations in one object
export const translations = {
  en: {
    ...auth.en,
    ...common.en,
    ...medicalHistory.en,
    ...medications.en,
    ...orders.en,
    ...patients.en,
    ...validations.en,
    ...vitals.en,
    ...tasks.en,
    ...appointments.en,
    ...users.en,
    ...emergency.en,
    ...hospital.en,
    ...telemedicine.en,
    
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
    ...auth.pt,
    ...common.pt,
    ...medicalHistory.pt,
    ...medications.pt,
    ...orders.pt,
    ...patients.pt,
    ...validations.pt,
    ...vitals.pt,
    ...tasks.pt,
    ...appointments.pt,
    ...users.pt,
    ...emergency.pt,
    ...hospital.pt,
    ...telemedicine.pt,
    
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
