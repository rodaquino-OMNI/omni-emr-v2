
export type TranslationKey = string;

export interface Translations {
  [language: string]: {
    [key: TranslationKey]: string;
  };
}

// Main translations object
export const translations: Translations = {
  en: {
    // App general
    appName: "OmniCare",
    appDescription: "Complete healthcare management solution",
    
    // Auth
    login: "Login",
    register: "Register",
    logout: "Logout",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    loginSuccessful: "Login successful",
    loginFailed: "Login failed",
    registerSuccessful: "Registration successful",
    registerFailed: "Registration failed",
    logoutSuccessful: "Logout successful",
    invalidCredentials: "Invalid email or password",
    
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    patients: "Patients",
    medications: "Medications",
    records: "Records",
    settings: "Settings",
    profile: "Profile",
    messages: "Messages",
    notifications: "Notifications",
    
    // Dashboard
    welcome: "Welcome",
    quickActions: "Quick Actions",
    recentActivity: "Recent Activity",
    upcomingTasks: "Upcoming Tasks",
    criticalAlerts: "Critical Alerts",
    todaysAppointments: "Today's Appointments",
    todaysPatients: "Today's Patients",
    pendingOrders: "Pending Orders",
    urgentTasks: "Urgent Tasks",
    needsAttention: "needs immediate attention",
    fromYesterday: "from yesterday",
    inLastHour: "in last hour",
    viewPatients: "View Patients",
    newNote: "New Note",
    prescribeMedication: "Prescribe",
    scheduleAppointment: "Schedule",
    changeSector: "Change Sector",
    viewDetails: "View Details",
    patientName: "Patient",
    
    // Sector selection
    selectSector: "Select Sector",
    selectSectorDescription: "Choose the hospital sector you want to work in",
    continue: "Continue",
    manageSectors: "Manage Sectors",
    availableSectors: "Available Sectors",
    noSectorsAvailable: "No sectors available",
    
    // Common actions
    search: "Search",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    
    // Error pages
    pageNotFound: "Page Not Found",
    pageNotFoundMessage: "The page you are looking for doesn't exist or has been moved.",
    unauthorized: "Unauthorized",
    unauthorizedMessage: "You don't have permission to access this page.",
    goBack: "Go Back",
    goToDashboard: "Go to Dashboard",
    
    // Home page
    heroTitle: "Modern Healthcare Management",
    heroSubtitle: "A comprehensive solution for healthcare professionals to manage patients, medications, and clinical workflows in one secure platform.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    features: "Key Features",
    patientManagement: "Patient Management",
    patientManagementDesc: "Comprehensive patient records with easy access to medical history.",
    clinicalDocumentation: "Clinical Documentation",
    clinicalDocumentationDesc: "Streamlined notes and documentation for healthcare professionals.",
    medicationManagement: "Medication Management",
    medicationManagementDesc: "Effortless medication ordering, prescribing, and administration.",
    hospitalWorkflows: "Hospital Workflows",
    hospitalWorkflowsDesc: "Optimized clinical workflows from admission to discharge.",
    allRightsReserved: "All rights reserved."
  },
  
  pt: {
    // App general
    appName: "OmniCare",
    appDescription: "Solução completa de gestão de saúde",
    
    // Auth
    login: "Entrar",
    register: "Registrar",
    logout: "Sair",
    email: "Email",
    password: "Senha",
    forgotPassword: "Esqueceu a senha?",
    signIn: "Entrar",
    signUp: "Registrar",
    createAccount: "Criar Conta",
    alreadyHaveAccount: "Já tem uma conta?",
    dontHaveAccount: "Não tem uma conta?",
    loginSuccessful: "Login realizado com sucesso",
    loginFailed: "Falha no login",
    registerSuccessful: "Registro realizado com sucesso",
    registerFailed: "Falha no registro",
    logoutSuccessful: "Logout realizado com sucesso",
    invalidCredentials: "Email ou senha inválidos",
    
    // Navigation
    home: "Início",
    dashboard: "Painel",
    patients: "Pacientes",
    medications: "Medicamentos",
    records: "Registros",
    settings: "Configurações",
    profile: "Perfil",
    messages: "Mensagens",
    notifications: "Notificações",
    
    // Dashboard
    welcome: "Bem-vindo",
    quickActions: "Ações Rápidas",
    recentActivity: "Atividade Recente",
    upcomingTasks: "Próximas Tarefas",
    criticalAlerts: "Alertas Críticos",
    todaysAppointments: "Consultas de Hoje",
    todaysPatients: "Pacientes de Hoje",
    pendingOrders: "Pedidos Pendentes",
    urgentTasks: "Tarefas Urgentes",
    needsAttention: "necessita atenção imediata",
    fromYesterday: "desde ontem",
    inLastHour: "na última hora",
    viewPatients: "Ver Pacientes",
    newNote: "Nova Nota",
    prescribeMedication: "Prescrever",
    scheduleAppointment: "Agendar",
    changeSector: "Mudar Setor",
    viewDetails: "Ver Detalhes",
    patientName: "Paciente",
    
    // Sector selection
    selectSector: "Selecionar Setor",
    selectSectorDescription: "Escolha o setor hospitalar em que você quer trabalhar",
    continue: "Continuar",
    manageSectors: "Gerenciar Setores",
    availableSectors: "Setores Disponíveis",
    noSectorsAvailable: "Nenhum setor disponível",
    
    // Common actions
    search: "Buscar",
    add: "Adicionar",
    edit: "Editar",
    delete: "Excluir",
    save: "Salvar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    back: "Voltar",
    next: "Próximo",
    previous: "Anterior",
    submit: "Enviar",
    
    // Error pages
    pageNotFound: "Página Não Encontrada",
    pageNotFoundMessage: "A página que você está procurando não existe ou foi movida.",
    unauthorized: "Não Autorizado",
    unauthorizedMessage: "Você não tem permissão para acessar esta página.",
    goBack: "Voltar",
    goToDashboard: "Ir para o Painel",
    
    // Home page
    heroTitle: "Gestão Moderna de Saúde",
    heroSubtitle: "Uma solução abrangente para profissionais de saúde gerenciarem pacientes, medicamentos e fluxos clínicos em uma plataforma segura.",
    getStarted: "Começar",
    learnMore: "Saiba Mais",
    features: "Recursos Principais",
    patientManagement: "Gestão de Pacientes",
    patientManagementDesc: "Registros abrangentes de pacientes com fácil acesso ao histórico médico.",
    clinicalDocumentation: "Documentação Clínica",
    clinicalDocumentationDesc: "Notas e documentação simplificadas para profissionais de saúde.",
    medicationManagement: "Gestão de Medicamentos",
    medicationManagementDesc: "Pedidos, prescrições e administração de medicamentos sem esforço.",
    hospitalWorkflows: "Fluxos Hospitalares",
    hospitalWorkflowsDesc: "Fluxos clínicos otimizados desde a admissão até a alta.",
    allRightsReserved: "Todos os direitos reservados."
  }
};
