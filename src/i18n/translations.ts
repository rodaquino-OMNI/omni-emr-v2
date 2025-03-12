
export type TranslationKey = 
  | 'appName'
  | 'dashboard'
  | 'patients'
  | 'records'
  | 'medications'
  | 'prescriptions'
  | 'schedule'
  | 'messages'
  | 'settings'
  | 'telemedicine'
  | 'help'
  | 'search'
  | 'profile'
  | 'logout'
  | 'userAdmin'
  | 'email'
  | 'password'
  | 'signIn'
  | 'invalidCredentials'
  | 'patientName'
  | 'status'
  | 'lastVisit'
  | 'nextAppointment'
  | 'viewProfile'
  | 'addPatient'
  | 'cancel'
  | 'save'
  | 'add'
  | 'editUser'
  | 'addUser'
  | 'userRole'
  | 'permissions'
  | 'back'
  | 'english'
  | 'portuguese'
  | 'system'
  | 'language'
  | 'prescribeMedication'
  | 'medicationName'
  | 'dosage'
  | 'frequency'
  | 'startDate'
  | 'endDate'
  | 'joinCall';

type Translations = {
  [key in TranslationKey]: string;
};

export const translations: Record<'en' | 'pt', Translations> = {
  pt: {
    appName: 'OmniCare',
    dashboard: 'Painel',
    patients: 'Pacientes',
    records: 'Registros Médicos',
    medications: 'Medicamentos',
    prescriptions: 'Prescrições',
    schedule: 'Agenda',
    messages: 'Mensagens',
    settings: 'Configurações',
    telemedicine: 'Telemedicina',
    help: 'Ajuda & Suporte',
    search: 'Pesquisar',
    profile: 'Perfil',
    logout: 'Sair',
    userAdmin: 'Administração de Usuários',
    email: 'Email',
    password: 'Senha',
    signIn: 'Entrar',
    invalidCredentials: 'Email ou senha inválidos',
    patientName: 'Nome',
    status: 'Status',
    lastVisit: 'Última Visita',
    nextAppointment: 'Próxima Consulta',
    viewProfile: 'Ver Perfil',
    addPatient: 'Adicionar Paciente',
    cancel: 'Cancelar',
    save: 'Salvar',
    add: 'Adicionar',
    editUser: 'Editar Usuário',
    addUser: 'Adicionar Usuário',
    userRole: 'Função',
    permissions: 'Permissões',
    back: 'Voltar',
    english: 'Inglês',
    portuguese: 'Português',
    system: 'Sistema',
    language: 'Idioma',
    prescribeMedication: 'Prescrever Medicamento',
    medicationName: 'Nome do Medicamento',
    dosage: 'Dosagem',
    frequency: 'Frequência',
    startDate: 'Data de Início',
    endDate: 'Data de Término',
    joinCall: 'Entrar na Chamada'
  },
  en: {
    appName: 'OmniCare',
    dashboard: 'Dashboard',
    patients: 'Patients',
    records: 'Medical Records',
    medications: 'Medications',
    prescriptions: 'Prescriptions',
    schedule: 'Schedule',
    messages: 'Messages',
    settings: 'Settings',
    telemedicine: 'Telemedicine',
    help: 'Help & Support',
    search: 'Search',
    profile: 'Profile',
    logout: 'Logout',
    userAdmin: 'User Administration',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    invalidCredentials: 'Invalid email or password',
    patientName: 'Name',
    status: 'Status',
    lastVisit: 'Last Visit',
    nextAppointment: 'Next Appointment',
    viewProfile: 'View Profile',
    addPatient: 'Add Patient',
    cancel: 'Cancel',
    save: 'Save',
    add: 'Add',
    editUser: 'Edit User',
    addUser: 'Add User',
    userRole: 'Role',
    permissions: 'Permissions',
    back: 'Back',
    english: 'English',
    portuguese: 'Portuguese',
    system: 'System',
    language: 'Language',
    prescribeMedication: 'Prescribe Medication',
    medicationName: 'Medication Name',
    dosage: 'Dosage',
    frequency: 'Frequency',
    startDate: 'Start Date',
    endDate: 'End Date',
    joinCall: 'Join Call'
  }
};
