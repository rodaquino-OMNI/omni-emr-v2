
export type PatientsTranslationKey =
  | 'patientName'
  | 'status'
  | 'lastVisit'
  | 'nextAppointment'
  | 'viewProfile'
  | 'addPatient'
  | 'patient'
  | 'patientInformation'
  | 'patientId'
  | 'viewPatientProfile';

export const patientsTranslations = {
  pt: {
    patientName: 'Nome',
    status: 'Status',
    lastVisit: 'Última Visita',
    nextAppointment: 'Próxima Consulta',
    viewProfile: 'Ver Perfil',
    addPatient: 'Adicionar Paciente',
    patient: 'Paciente',
    patientInformation: 'Informações do paciente',
    patientId: 'ID do paciente',
    viewPatientProfile: 'Ver perfil do paciente'
  },
  en: {
    patientName: 'Name',
    status: 'Status',
    lastVisit: 'Last Visit',
    nextAppointment: 'Next Appointment',
    viewProfile: 'View Profile',
    addPatient: 'Add Patient',
    patient: 'Patient',
    patientInformation: 'Patient information',
    patientId: 'Patient ID',
    viewPatientProfile: 'View patient profile'
  }
};
