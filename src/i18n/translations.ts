import { patientsTranslations } from './categories/patients';
import { usersTranslations } from './categories/users';
import { authTranslations } from './categories/auth';
import { commonTranslations } from './categories/common';

// Define the type for translation keys
export type TranslationKey = string;

// Import all translation categories from index file
import { allTranslations } from './categories/index';

// Merge all translation categories
export const translations = {
  // App general translations
  appName: {
    en: 'OmniCare',
    pt: 'OmniCare'
  },
  appDescription: {
    en: 'Welcome to your healthcare platform.',
    pt: 'Bem-vindo à sua plataforma de saúde.'
  },
  welcomeTo: {
    en: 'Welcome to',
    pt: 'Bem-vindo ao'
  },
  
  // Auth translations
  signIn: {
    en: 'Sign in to your account',
    pt: 'Entre na sua conta'
  },
  createAccount: {
    en: 'Create Account',
    pt: 'Criar Conta'
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
  sendReminder: {
    en: 'Send Reminder',
    pt: 'Enviar Lembrete'
  },
  
  // Language
  english: {
    en: 'English',
    pt: 'Inglês'
  },
  portuguese: {
    en: 'Portuguese',
    pt: 'Português'
  },
  
  // Dashboard
  dashboard: {
    en: 'Dashboard',
    pt: 'Painel'
  },
  goToDashboard: {
    en: 'Go to Dashboard',
    pt: 'Ir para o Painel'
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
  goBack: {
    en: 'Go back',
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
  
  // Appointments
  cancelAppointment: {
    en: 'Cancel Appointment',
    pt: 'Cancelar Consulta'
  },
  cancelAppointmentDescription: {
    en: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
    pt: 'Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.'
  },
  confirmCancel: {
    en: 'Yes, cancel appointment',
    pt: 'Sim, cancelar consulta'
  },
  
  // Security
  hipaaComplianceTitle: {
    en: 'HIPAA Compliant',
    pt: 'Em conformidade com HIPAA'
  },
  hipaaComplianceDescription: {
    en: 'This medical data is securely stored and transmitted in accordance with HIPAA regulations.',
    pt: 'Estes dados médicos são armazenados e transmitidos com segurança de acordo com as regulamentações HIPAA.'
  },
  
  // Vitals translation keys
  heartRate: {
    en: 'Heart Rate',
    pt: 'Frequência Cardíaca'
  },
  bpm: {
    en: 'BPM',
    pt: 'BPM'
  },
  bloodPressure: {
    en: 'Blood Pressure',
    pt: 'Pressão Arterial'
  }, 
  mmHg: {
    en: 'mmHg',
    pt: 'mmHg'
  },
  temperature: {
    en: 'Temperature',
    pt: 'Temperatura'
  },
  oxygenSaturation: {
    en: 'Oxygen Saturation',
    pt: 'Saturação de Oxigênio'
  },
  respiratoryRate: {
    en: 'Respiratory Rate',
    pt: 'Frequência Respiratória'
  },
  breathsPerMinute: {
    en: 'breaths/min',
    pt: 'resp/min'
  },
  bloodGlucose: {
    en: 'Blood Glucose',
    pt: 'Glicemia'
  },
  painLevel: {
    en: 'Pain Level',
    pt: 'Nível de Dor'
  },
  
  // Login/authentication
  loginSuccess: {
    en: 'Login successful',
    pt: 'Login bem-sucedido'
  },
  welcomeBack: {
    en: 'Welcome back!',
    pt: 'Bem-vindo de volta!'
  },

  // Critical result management
  criticalResultsManagement: {
    en: 'Critical Results Management',
    pt: 'Gestão de Resultados Críticos'
  },
  criticalResult: {
    en: 'Critical Result',
    pt: 'Resultado Crítico'
  },
  urgentResult: {
    en: 'Urgent Result',
    pt: 'Resultado Urgente'
  },
  abnormalResult: {
    en: 'Abnormal Result',
    pt: 'Resultado Anormal'
  },
  value: {
    en: 'Value',
    pt: 'Valor'
  },
  normalRange: {
    en: 'Normal Range',
    pt: 'Faixa Normal'
  },
  view: {
    en: 'View',
    pt: 'Visualizar'
  },
  acknowledge: {
    en: 'Acknowledge',
    pt: 'Confirmar Recebimento'
  },
  acknowledged: {
    en: 'Acknowledged',
    pt: 'Recebido'
  },
  unacknowledged: {
    en: 'Unacknowledged',
    pt: 'Não Recebido'
  },
  all: {
    en: 'All',
    pt: 'Todos'
  },
  noCriticalResults: {
    en: 'No critical results to display',
    pt: 'Não há resultados críticos para exibir'
  },
  noUnacknowledgedResults: {
    en: 'No unacknowledged critical results',
    pt: 'Não há resultados críticos não recebidos'
  },
  noAcknowledgedResults: {
    en: 'No acknowledged critical results',
    pt: 'Não há resultados críticos recebidos'
  },
  loadingCriticalResults: {
    en: 'Loading critical results',
    pt: 'Carregando resultados críticos'
  },
  criticalResultDetails: {
    en: 'Critical Result Details',
    pt: 'Detalhes do Resultado Crítico'
  },
  pendingAcknowledgment: {
    en: 'Pending Acknowledgment',
    pt: 'Confirmação Pendente'
  },
  acknowledgedBy: {
    en: 'Acknowledged by',
    pt: 'Recebido por'
  },
  on: {
    en: 'on',
    pt: 'em'
  },
  patient: {
    en: 'Patient',
    pt: 'Paciente'
  },
  resultType: {
    en: 'Result Type',
    pt: 'Tipo de Resultado'
  },
  laboratoryResult: {
    en: 'Laboratory Result',
    pt: 'Resultado de Laboratório'
  },
  imagingResult: {
    en: 'Imaging Result',
    pt: 'Resultado de Imagem'
  },
  vitalSign: {
    en: 'Vital Sign',
    pt: 'Sinal Vital'
  },
  resultName: {
    en: 'Test/Result Name',
    pt: 'Nome do Teste/Resultado'
  },
  reportedAt: {
    en: 'Reported At',
    pt: 'Reportado Em'
  },
  close: {
    en: 'Close',
    pt: 'Fechar'
  },
  errorFetchingCriticalResults: {
    en: 'Failed to fetch critical results. Please try again.',
    pt: 'Falha ao buscar resultados críticos. Por favor, tente novamente.'
  },
  criticalResultAcknowledged: {
    en: 'Critical result has been acknowledged',
    pt: 'Resultado crítico foi confirmado'
  },
  errorAcknowledgingResult: {
    en: 'Failed to acknowledge critical result. Please try again.',
    pt: 'Falha ao confirmar recebimento do resultado crítico. Por favor, tente novamente.'
  },
  unauthorizedAccess: {
    en: 'You do not have permission to view critical results.',
    pt: 'Você não tem permissão para visualizar resultados críticos.'
  },
  
  // Import category translations
  ...patientsTranslations,
  ...usersTranslations,
  ...authTranslations,
  ...commonTranslations,
};
