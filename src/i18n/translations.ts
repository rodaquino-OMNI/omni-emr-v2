
import { patientsTranslations } from './categories/patients';
import { usersTranslations } from './categories/users';

// Define the type for translation keys
export type TranslationKey = string;

// Merge all translation categories
export const translations = {
  appName: {
    en: 'OmniCare',
    pt: 'OmniCare'
  },
  
  // Auth translations
  signIn: {
    en: 'Sign in to your account',
    pt: 'Entre na sua conta'
  },
  email: {
    en: 'Email',
    pt: 'Email'
  },
  password: {
    en: 'Password',
    pt: 'Senha'
  },
  login: {
    en: 'Log in',
    pt: 'Entrar'
  },
  forgotPassword: {
    en: 'Forgot password?',
    pt: 'Esqueceu a senha?'
  },
  
  // Dashboard
  dashboard: {
    en: 'Dashboard',
    pt: 'Painel'
  },
  
  // Navigation
  patients: {
    en: 'Patients',
    pt: 'Pacientes'
  },
  appointments: {
    en: 'Appointments',
    pt: 'Consultas'
  },
  tasks: {
    en: 'Tasks',
    pt: 'Tarefas'
  },
  medications: {
    en: 'Medications',
    pt: 'Medicamentos'
  },
  records: {
    en: 'Records',
    pt: 'Registros'
  },
  settings: {
    en: 'Settings',
    pt: 'Configurações'
  },
  
  // Common actions
  search: {
    en: 'Search',
    pt: 'Buscar'
  },
  save: {
    en: 'Save',
    pt: 'Salvar'
  },
  cancel: {
    en: 'Cancel',
    pt: 'Cancelar'
  },
  delete: {
    en: 'Delete',
    pt: 'Excluir'
  },
  edit: {
    en: 'Edit',
    pt: 'Editar'
  },
  back: {
    en: 'Back',
    pt: 'Voltar'
  },
  
  // Status messages
  loading: {
    en: 'Loading',
    pt: 'Carregando'
  },
  loadingAppointments: {
    en: 'Loading appointments',
    pt: 'Carregando consultas'
  },
  loadingHistory: {
    en: 'Loading medical history',
    pt: 'Carregando histórico médico'
  },
  noAppointmentsScheduled: {
    en: 'No appointments scheduled for this date',
    pt: 'Não há consultas agendadas para esta data'
  },
  noAppointmentsForPatient: {
    en: 'No appointments for this patient',
    pt: 'Não há consultas para este paciente'
  },
  selectDateToViewAppointments: {
    en: 'Select a date to view appointments',
    pt: 'Selecione uma data para ver as consultas'
  },
  errorLoadingAppointments: {
    en: 'Error loading appointments',
    pt: 'Erro ao carregar consultas'
  },
  noTasksFound: {
    en: 'No tasks found',
    pt: 'Nenhuma tarefa encontrada'
  },
  noInsightsAvailable: {
    en: 'No insights available',
    pt: 'Nenhuma informação disponível'
  },
  noHistoricalUpdates: {
    en: 'No historical updates available',
    pt: 'Nenhuma atualização histórica disponível'
  },
  completed: {
    en: 'Completed',
    pt: 'Concluído'
  },
  delayed: {
    en: 'Delayed',
    pt: 'Atrasado'
  },
  onTime: {
    en: 'On time',
    pt: 'No prazo'
  },
  total: {
    en: 'Total',
    pt: 'Total'
  },
  pending: {
    en: 'Pending',
    pt: 'Pendente'
  },
  scheduleConsultation: {
    en: 'Schedule Consultation',
    pt: 'Agendar Consulta'
  },
  hipaaComplianceTitle: {
    en: 'HIPAA Compliant',
    pt: 'Em conformidade com HIPAA'
  },
  hipaaComplianceDescription: {
    en: 'This medical data is securely stored and transmitted in accordance with HIPAA regulations.',
    pt: 'Estes dados médicos são armazenados e transmitidos com segurança de acordo com as regulamentações HIPAA.'
  },
  
  // Import category translations
  ...patientsTranslations,
  ...usersTranslations,
};
