
export type TranslationKey = 
  | 'appName'
  | 'dashboard'
  | 'patients'
  | 'records'
  | 'medications'
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
  | 'back';

type Translations = {
  [key in TranslationKey]: string;
};

export const translations: Record<'en' | 'pt' | 'es', Translations> = {
  en: {
    appName: 'MedCare',
    dashboard: 'Dashboard',
    patients: 'Patients',
    records: 'Medical Records',
    medications: 'Medications',
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
    back: 'Back'
  },
  pt: {
    appName: 'MedCare',
    dashboard: 'Painel',
    patients: 'Pacientes',
    records: 'Registros Médicos',
    medications: 'Medicamentos',
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
    back: 'Voltar'
  },
  es: {
    appName: 'MedCare',
    dashboard: 'Panel',
    patients: 'Pacientes',
    records: 'Registros Médicos',
    medications: 'Medicamentos',
    schedule: 'Agenda',
    messages: 'Mensajes',
    settings: 'Configuración',
    telemedicine: 'Telemedicina',
    help: 'Ayuda & Soporte',
    search: 'Buscar',
    profile: 'Perfil',
    logout: 'Cerrar Sesión',
    userAdmin: 'Administración de Usuarios',
    email: 'Correo',
    password: 'Contraseña',
    signIn: 'Iniciar Sesión',
    invalidCredentials: 'Correo o contraseña inválidos',
    patientName: 'Nombre',
    status: 'Estado',
    lastVisit: 'Última Visita',
    nextAppointment: 'Próxima Cita',
    viewProfile: 'Ver Perfil',
    addPatient: 'Añadir Paciente',
    cancel: 'Cancelar',
    save: 'Guardar',
    add: 'Añadir',
    editUser: 'Editar Usuario',
    addUser: 'Añadir Usuario',
    userRole: 'Rol',
    permissions: 'Permisos',
    back: 'Regresar'
  }
};
