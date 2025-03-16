
import { Languages } from '@/types/auth';

// Type for our translations structure
interface TranslationDictionary {
  [key: string]: string;
}

// Interface for all languages
interface Translations {
  [key in Languages]: TranslationDictionary;
}

// Define translations for all supported languages
export const translations: Translations = {
  en: {
    // Generic
    appName: 'OmniCare',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    back: 'Back',
    
    // Authentication
    login: 'Login',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    enterCredentials: 'Enter your credentials to continue',
    forgotPassword: 'Forgot password?',
    resetPassword: 'Reset password',
    createAccount: 'Create account',
    phoneNumber: 'Phone number',
    verificationCode: 'Verification code',
    sendVerificationCode: 'Send verification code',
    verifyCode: 'Verify code',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    fullName: 'Full name',
    fullNameRequired: 'Full name is required',
    
    // Dashboard
    dashboard: 'Dashboard',
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    upcomingTasks: 'Upcoming Tasks',
    patientOverview: 'Patient Overview',
    notifications: 'Notifications',
    sectors: 'Sectors',
    selectSector: 'Select a sector',
    
    // Patient Management
    patients: 'Patients',
    patientDetails: 'Patient Details',
    patientProfile: 'Patient Profile',
    medicalHistory: 'Medical History',
    addNewPatient: 'Add New Patient',
    editPatient: 'Edit Patient',
    patientId: 'Patient ID',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    address: 'Address',
    contactInfo: 'Contact Information',
    emergencyContact: 'Emergency Contact',
    
    // Medication Management
    medications: 'Medications',
    prescriptions: 'Prescriptions',
    prescribeMedication: 'Prescribe Medication',
    medicationDetails: 'Medication Details',
    dosage: 'Dosage',
    frequency: 'Frequency',
    duration: 'Duration',
    administrationRoute: 'Administration Route',
    sideEffects: 'Side Effects',
    interactions: 'Interactions',
    
    // Permissions and Access
    unauthorized: 'Unauthorized',
    accessDenied: 'Access Denied',
    insufficientPermissions: 'Insufficient Permissions',
    contactAdmin: 'Please contact an administrator for access',
    
    // Error Messages
    somethingWentWrong: 'Something went wrong',
    tryAgain: 'Please try again',
    serviceUnavailable: 'Service Unavailable',
    connectionError: 'Connection Error',
    timeoutError: 'Request Timed Out',
    
    // Settings
    settings: 'Settings',
    account: 'Account',
    profile: 'Profile',
    preferences: 'Preferences',
    theme: 'Theme',
    language: 'Language',
    notifications: 'Notifications',
    security: 'Security',
    changePassword: 'Change Password',
    twoFactorAuth: 'Two-Factor Authentication',
    
    // Misc
    help: 'Help',
    support: 'Support',
    documentation: 'Documentation',
    about: 'About',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
  },
  
  pt: {
    // Generic
    appName: 'OmniCare',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Salvar',
    delete: 'Excluir',
    edit: 'Editar',
    view: 'Visualizar',
    search: 'Pesquisar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    back: 'Voltar',
    
    // Authentication
    login: 'Entrar',
    signIn: 'Entrar',
    signOut: 'Sair',
    register: 'Registrar',
    email: 'Email',
    password: 'Senha',
    enterCredentials: 'Digite suas credenciais para continuar',
    forgotPassword: 'Esqueceu a senha?',
    resetPassword: 'Redefinir senha',
    createAccount: 'Criar conta',
    phoneNumber: 'Número de telefone',
    verificationCode: 'Código de verificação',
    sendVerificationCode: 'Enviar código de verificação',
    verifyCode: 'Verificar código',
    emailRequired: 'Email é obrigatório',
    passwordRequired: 'Senha é obrigatória',
    fullName: 'Nome completo',
    fullNameRequired: 'Nome completo é obrigatório',
    
    // Dashboard
    dashboard: 'Painel',
    welcome: 'Bem-vindo',
    welcomeBack: 'Bem-vindo de volta',
    quickActions: 'Ações Rápidas',
    recentActivity: 'Atividade Recente',
    upcomingTasks: 'Tarefas Pendentes',
    patientOverview: 'Visão Geral de Pacientes',
    notifications: 'Notificações',
    sectors: 'Setores',
    selectSector: 'Selecione um setor',
    
    // Patient Management
    patients: 'Pacientes',
    patientDetails: 'Detalhes do Paciente',
    patientProfile: 'Perfil do Paciente',
    medicalHistory: 'Histórico Médico',
    addNewPatient: 'Adicionar Novo Paciente',
    editPatient: 'Editar Paciente',
    patientId: 'ID do Paciente',
    dateOfBirth: 'Data de Nascimento',
    gender: 'Gênero',
    address: 'Endereço',
    contactInfo: 'Informações de Contato',
    emergencyContact: 'Contato de Emergência',
    
    // Medication Management
    medications: 'Medicamentos',
    prescriptions: 'Prescrições',
    prescribeMedication: 'Prescrever Medicamento',
    medicationDetails: 'Detalhes do Medicamento',
    dosage: 'Dosagem',
    frequency: 'Frequência',
    duration: 'Duração',
    administrationRoute: 'Via de Administração',
    sideEffects: 'Efeitos Colaterais',
    interactions: 'Interações',
    
    // Permissions and Access
    unauthorized: 'Não Autorizado',
    accessDenied: 'Acesso Negado',
    insufficientPermissions: 'Permissões Insuficientes',
    contactAdmin: 'Por favor, contate um administrador para acesso',
    
    // Error Messages
    somethingWentWrong: 'Algo deu errado',
    tryAgain: 'Por favor, tente novamente',
    serviceUnavailable: 'Serviço Indisponível',
    connectionError: 'Erro de Conexão',
    timeoutError: 'Tempo de Requisição Esgotado',
    
    // Settings
    settings: 'Configurações',
    account: 'Conta',
    profile: 'Perfil',
    preferences: 'Preferências',
    theme: 'Tema',
    language: 'Idioma',
    notifications: 'Notificações',
    security: 'Segurança',
    changePassword: 'Alterar Senha',
    twoFactorAuth: 'Autenticação de Dois Fatores',
    
    // Misc
    help: 'Ajuda',
    support: 'Suporte',
    documentation: 'Documentação',
    about: 'Sobre',
    termsOfService: 'Termos de Serviço',
    privacyPolicy: 'Política de Privacidade',
  }
};
