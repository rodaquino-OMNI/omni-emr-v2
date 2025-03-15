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
    // App basics
    appName: "OmniCare",
    appDescription: "Complete healthcare management solution",
    createAccount: "Create Account",
    signIn: "Sign in",
    goToDashboard: "Go to Dashboard",
    
    // Visit Notes and Discharge related translations
    visitNotes: 'Visit Notes',
    discharge: 'Discharge',
    dischargePatient: 'Discharge Patient',
    dischargeNotes: 'Discharge Notes',
    dischargeInstructions: 'Discharge Instructions',
    dischargeDate: 'Discharge Date',
    
    // Nurse-specific functionality translations
    medicationAdministration: 'Medication Administration',
    administeredMedications: 'Administered Medications',
    medicationsDue: 'Medications Due',
    administer: 'Administer',
    fluidBalance: 'Fluid Balance',
    fluidIntake: 'Fluid Intake',
    fluidOutput: 'Fluid Output',
    recordFluidBalance: 'Record Fluid Balance',
    nurseDashboard: 'Nurse Dashboard',
    
    // Quick actions translations for various roles
    quickActions: 'Quick Actions',
    newConsultation: 'New Consultation',
    patientRecords: 'Patient Records',
    newPrescription: 'New Prescription',
    labOrders: 'Lab Orders',
    verifyPrescriptions: 'Verify Prescriptions',
    medicationRecords: 'Medication Records',
    myAppointments: 'My Appointments',
    myMedications: 'My Medications',
    myRecords: 'My Records',
    managePatients: 'Manage Patients',
    scheduleAppointment: 'Schedule Appointment',
    
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
    
    // Medication autocomplete translations
    loading: 'Loading',
    advancedSearch: 'Advanced Search',
    medicationFound: 'Medication found',
    medicationNotFound: 'No medications found',
    searchByName: 'Search by name',
    selectAMedication: 'Select a medication',
    recentlyUsed: 'Recently used',
    popularMedications: 'Popular medications',
    pressEnterToSearch: 'Press Enter to search',
    typeToSearch: 'Type to search',
  },
  pt: {
    // App basics
    appName: "OmniCare",
    appDescription: "Solução completa de gestão em saúde",
    createAccount: "Criar Conta",
    signIn: "Entrar",
    goToDashboard: "Ir para o Painel",
    
    // Visit Notes and Discharge related translations
    visitNotes: 'Notas de Visita',
    discharge: 'Alta',
    dischargePatient: 'Alta do Paciente',
    dischargeNotes: 'Notas de Alta',
    dischargeInstructions: 'Instruções de Alta',
    dischargeDate: 'Data da Alta',
    
    // Nurse-specific functionality translations
    medicationAdministration: 'Administração de Medicamentos',
    administeredMedications: 'Medicamentos Administrados',
    medicationsDue: 'Medicamentos Pendentes',
    administer: 'Administrar',
    fluidBalance: 'Balanço Hídrico',
    fluidIntake: 'Entrada de Fluidos',
    fluidOutput: 'Saída de Fluidos',
    recordFluidBalance: 'Registrar Balanço Hídrico',
    nurseDashboard: 'Painel da Enfermagem',
    
    // Quick actions translations for various roles
    quickActions: 'Ações Rápidas',
    newConsultation: 'Nova Consulta',
    patientRecords: 'Registros do Paciente',
    newPrescription: 'Nova Prescrição',
    labOrders: 'Pedidos de Laboratório',
    verifyPrescriptions: 'Verificar Prescrições',
    medicationRecords: 'Registros de Medicação',
    myAppointments: 'Minhas Consultas',
    myMedications: 'Meus Medicamentos',
    myRecords: 'Meus Registros',
    managePatients: 'Gerenciar Pacientes',
    scheduleAppointment: 'Agendar Consulta',
    
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
    
    // Medication autocomplete translations
    loading: 'Carregando',
    advancedSearch: 'Busca Avançada',
    medicationFound: 'Medicamento encontrado',
    medicationNotFound: 'Nenhum medicamento encontrado',
    searchByName: 'Buscar por nome',
    selectAMedication: 'Selecione um medicamento',
    recentlyUsed: 'Usados recentemente',
    popularMedications: 'Medicamentos populares',
    pressEnterToSearch: 'Pressione Enter para buscar',
    typeToSearch: 'Digite para buscar',
  }
};

// Type for translation keys
export type TranslationKey = keyof typeof translations.en;
