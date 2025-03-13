
export type TranslationKey = 
  | 'appName'
  | 'dashboard'
  | 'patients'
  | 'records'
  | 'medications'
  | 'prescriptions'
  | 'schedule'
  | 'messages'
  | 'notifications'
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
  | 'joinCall'
  | 'tasks'
  | 'allTasks'
  | 'taskType'
  | 'dueDate'
  | 'patient'
  | 'sector'
  | 'priority'
  | 'delayed'
  | 'onTime'
  | 'filterBy'
  | 'clearFilters'
  | 'markAsComplete'
  | 'taskDetails'
  // Schedule and Appointments related
  | 'loadingAppointments'
  | 'errorLoadingAppointments'
  | 'noAppointmentsScheduled'
  | 'noAppointmentsForPatient'
  | 'selectDateToViewAppointments'
  | 'inPerson'
  | 'telemedicine'
  | 'phone'
  | 'reminderSent'
  | 'reminderSentDescription'
  | 'errorSendingReminder'
  | 'errorSendingReminderDescription'
  | 'appointmentCompleted'
  | 'appointmentCompletedDescription'
  | 'errorCompletingAppointment'
  | 'errorCompletingAppointmentDescription'
  | 'appointmentCancelled'
  | 'appointmentCancelledDescription'
  | 'errorCancellingAppointment'
  | 'errorCancellingAppointmentDescription'
  | 'sendReminder'
  | 'cancelAppointment'
  | 'cancelAppointmentDescription'
  | 'goBack'
  | 'confirmCancel'
  | 'options'
  | 'reminderAlreadySent'
  | 'markAsCompleted'
  | 'viewPatientProfile'
  | 'minutes'
  | 'provider'
  | 'notes'
  | 'patientInformation'
  | 'patientId'
  | 'consultationDetails'
  | 'consultationTitle'
  | 'schedulingInformation'
  | 'appointmentDate'
  | 'selectDate'
  | 'appointmentTime'
  | 'selectTime'
  | 'duration'
  | 'selectDuration'
  | 'consultationType'
  | 'location'
  | 'reminderDescription'
  | 'scheduleConsultation'
  | 'appointmentScheduled'
  | 'appointmentScheduledSuccess'
  | 'refresh'
  | 'newAppointment'
  | 'appointments'
  | 'reminders'
  | 'loading'
  | 'noRemindersScheduled'
  // Task related
  | 'completed'
  | 'completedBy'
  | 'completedAt'
  | 'viewTaskDetails'
  | 'completeTask'
  | 'completeTaskDescription'
  | 'completionNotes'
  | 'enterCompletionNotes'
  | 'completing'
  | 'noTasksFound'
  | 'total'
  | 'pending'
  // Error handling and session related
  | 'errorTitle'
  | 'errorDescription'
  | 'retryButton'
  | 'goToDashboard'
  | 'sessionExpiredTitle'
  | 'sessionExpiredDescription'
  | 'sessionExpiringTitle'
  | 'sessionExpiringDescription'
  | 'stayLoggedIn'
  | 'loginRequired'
  | 'loginRequiredDescription'
  | 'unexpectedError'
  | 'loadingData'
  | 'loadingResources';

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
    notifications: 'Notificações',
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
    joinCall: 'Entrar na Chamada',
    tasks: 'Tarefas',
    allTasks: 'Todas as Tarefas',
    taskType: 'Tipo de Tarefa',
    dueDate: 'Data de Vencimento',
    patient: 'Paciente',
    sector: 'Setor',
    priority: 'Prioridade',
    delayed: 'Atrasado',
    onTime: 'Em Dia',
    filterBy: 'Filtrar por',
    clearFilters: 'Limpar Filtros',
    markAsComplete: 'Marcar como Concluído',
    taskDetails: 'Detalhes da Tarefa',
    // Schedule and Appointments related
    loadingAppointments: 'Carregando consultas',
    errorLoadingAppointments: 'Erro ao carregar consultas',
    noAppointmentsScheduled: 'Nenhuma consulta agendada para esta data',
    noAppointmentsForPatient: 'Este paciente não tem consultas agendadas',
    selectDateToViewAppointments: 'Selecione uma data para ver as consultas',
    inPerson: 'Presencial',
    phone: 'Telefone',
    reminderSent: 'Lembrete enviado',
    reminderSentDescription: 'Um lembrete foi enviado ao paciente',
    errorSendingReminder: 'Erro ao enviar lembrete',
    errorSendingReminderDescription: 'Não foi possível enviar o lembrete ao paciente',
    appointmentCompleted: 'Consulta concluída',
    appointmentCompletedDescription: 'A consulta foi marcada como concluída',
    errorCompletingAppointment: 'Erro ao concluir consulta',
    errorCompletingAppointmentDescription: 'Não foi possível marcar a consulta como concluída',
    appointmentCancelled: 'Consulta cancelada',
    appointmentCancelledDescription: 'A consulta foi cancelada',
    errorCancellingAppointment: 'Erro ao cancelar consulta',
    errorCancellingAppointmentDescription: 'Não foi possível cancelar a consulta',
    sendReminder: 'Enviar lembrete',
    cancelAppointment: 'Cancelar consulta',
    cancelAppointmentDescription: 'Tem certeza que deseja cancelar esta consulta?',
    goBack: 'Voltar',
    confirmCancel: 'Confirmar cancelamento',
    options: 'Opções',
    reminderAlreadySent: 'Lembrete já enviado',
    markAsCompleted: 'Marcar como concluída',
    viewPatientProfile: 'Ver perfil do paciente',
    minutes: 'minutos',
    provider: 'Profissional',
    notes: 'Observações',
    patientInformation: 'Informações do paciente',
    patientId: 'ID do paciente',
    consultationDetails: 'Detalhes da consulta',
    consultationTitle: 'Título da consulta',
    schedulingInformation: 'Informações de agendamento',
    appointmentDate: 'Data da consulta',
    selectDate: 'Selecione uma data',
    appointmentTime: 'Horário da consulta',
    selectTime: 'Selecione um horário',
    duration: 'Duração',
    selectDuration: 'Selecione a duração',
    consultationType: 'Tipo de consulta',
    location: 'Local',
    reminderDescription: 'Enviar lembrete ao paciente antes da consulta',
    scheduleConsultation: 'Agendar consulta',
    appointmentScheduled: 'Consulta agendada',
    appointmentScheduledSuccess: 'A consulta foi agendada com sucesso',
    refresh: 'Atualizar',
    newAppointment: 'Nova consulta',
    appointments: 'Consultas',
    reminders: 'Lembretes',
    loading: 'Carregando',
    noRemindersScheduled: 'Nenhum lembrete agendado',
    // Task related
    completed: 'Concluído',
    completedBy: 'Concluído por',
    completedAt: 'Concluído em',
    viewTaskDetails: 'Ver detalhes da tarefa',
    completeTask: 'Concluir tarefa',
    completeTaskDescription: 'Preencha as informações abaixo para marcar esta tarefa como concluída',
    completionNotes: 'Notas de conclusão',
    enterCompletionNotes: 'Digite notas sobre a conclusão desta tarefa',
    completing: 'Concluindo',
    noTasksFound: 'Nenhuma tarefa encontrada',
    total: 'Total',
    pending: 'Pendente',
    // Error handling and session related
    errorTitle: 'Ocorreu um erro',
    errorDescription: 'Não foi possível completar a operação solicitada',
    retryButton: 'Tentar novamente',
    goToDashboard: 'Ir para o Painel',
    sessionExpiredTitle: 'Sessão expirada',
    sessionExpiredDescription: 'Sua sessão expirou devido a inatividade. Por favor, faça login novamente.',
    sessionExpiringTitle: 'Sessão prestes a expirar',
    sessionExpiringDescription: 'Sua sessão expirará em breve devido a inatividade. Clique em qualquer lugar para continuar.',
    stayLoggedIn: 'Continuar sessão',
    loginRequired: 'Login necessário',
    loginRequiredDescription: 'Por favor, faça login para acessar esta página',
    unexpectedError: 'Ocorreu um erro inesperado',
    loadingData: 'Carregando dados',
    loadingResources: 'Carregando recursos'
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
    notifications: 'Notifications',
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
    joinCall: 'Join Call',
    tasks: 'Tasks',
    allTasks: 'All Tasks',
    taskType: 'Task Type',
    dueDate: 'Due Date',
    patient: 'Patient',
    sector: 'Sector',
    priority: 'Priority',
    delayed: 'Delayed',
    onTime: 'On Time',
    filterBy: 'Filter By',
    clearFilters: 'Clear Filters',
    markAsComplete: 'Mark as Complete',
    taskDetails: 'Task Details',
    // Schedule and Appointments related
    loadingAppointments: 'Loading appointments',
    errorLoadingAppointments: 'Error loading appointments',
    noAppointmentsScheduled: 'No appointments scheduled for this date',
    noAppointmentsForPatient: 'This patient has no scheduled appointments',
    selectDateToViewAppointments: 'Select a date to view appointments',
    inPerson: 'In Person',
    phone: 'Phone',
    reminderSent: 'Reminder sent',
    reminderSentDescription: 'A reminder has been sent to the patient',
    errorSendingReminder: 'Error sending reminder',
    errorSendingReminderDescription: 'Could not send reminder to patient',
    appointmentCompleted: 'Appointment completed',
    appointmentCompletedDescription: 'The appointment has been marked as completed',
    errorCompletingAppointment: 'Error completing appointment',
    errorCompletingAppointmentDescription: 'Could not mark appointment as completed',
    appointmentCancelled: 'Appointment cancelled',
    appointmentCancelledDescription: 'The appointment has been cancelled',
    errorCancellingAppointment: 'Error cancelling appointment',
    errorCancellingAppointmentDescription: 'Could not cancel the appointment',
    sendReminder: 'Send reminder',
    cancelAppointment: 'Cancel appointment',
    cancelAppointmentDescription: 'Are you sure you want to cancel this appointment?',
    goBack: 'Go back',
    confirmCancel: 'Confirm cancellation',
    options: 'Options',
    reminderAlreadySent: 'Reminder already sent',
    markAsCompleted: 'Mark as completed',
    viewPatientProfile: 'View patient profile',
    minutes: 'minutes',
    provider: 'Provider',
    notes: 'Notes',
    patientInformation: 'Patient information',
    patientId: 'Patient ID',
    consultationDetails: 'Consultation details',
    consultationTitle: 'Consultation title',
    schedulingInformation: 'Scheduling information',
    appointmentDate: 'Appointment date',
    selectDate: 'Select a date',
    appointmentTime: 'Appointment time',
    selectTime: 'Select a time',
    duration: 'Duration',
    selectDuration: 'Select duration',
    consultationType: 'Consultation type',
    location: 'Location',
    reminderDescription: 'Send a reminder to patient before appointment',
    scheduleConsultation: 'Schedule consultation',
    appointmentScheduled: 'Appointment scheduled',
    appointmentScheduledSuccess: 'The appointment has been scheduled successfully',
    refresh: 'Refresh',
    newAppointment: 'New appointment',
    appointments: 'Appointments',
    reminders: 'Reminders',
    loading: 'Loading',
    noRemindersScheduled: 'No reminders scheduled',
    // Task related
    completed: 'Completed',
    completedBy: 'Completed by',
    completedAt: 'Completed at',
    viewTaskDetails: 'View task details',
    completeTask: 'Complete task',
    completeTaskDescription: 'Fill in the information below to mark this task as complete',
    completionNotes: 'Completion notes',
    enterCompletionNotes: 'Enter notes about completing this task',
    completing: 'Completing',
    noTasksFound: 'No tasks found',
    total: 'Total',
    pending: 'Pending',
    // Error handling and session related
    errorTitle: 'An error occurred',
    errorDescription: 'We could not complete the requested operation',
    retryButton: 'Try again',
    goToDashboard: 'Go to Dashboard',
    sessionExpiredTitle: 'Session expired',
    sessionExpiredDescription: 'Your session has expired due to inactivity. Please log in again.',
    sessionExpiringTitle: 'Session expiring soon',
    sessionExpiringDescription: 'Your session will expire soon due to inactivity. Click anywhere to stay logged in.',
    stayLoggedIn: 'Stay logged in',
    loginRequired: 'Login required',
    loginRequiredDescription: 'Please log in to access this page',
    unexpectedError: 'An unexpected error occurred',
    loadingData: 'Loading data',
    loadingResources: 'Loading resources'
  }
};
