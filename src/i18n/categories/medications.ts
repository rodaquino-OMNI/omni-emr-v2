
export const medicationsTranslations = {
  en: {
    medicationAdministration: 'Medication Administration',
    enhancedSafety: 'Enhanced safety with scanning and verification',
    scanMode: 'Scan Mode',
    exitScanMode: 'Exit Scan Mode',
    reports: 'Reports',
    patients: 'Patients',
    medicationsDue: 'meds due',
    selectPatientToViewMedications: 'Select a patient to view medications',
    searchPatients: 'Search patients...',
    name: 'Name',
    mrn: 'MRN',
    room: 'Room',
    due: 'Due',
    medications: 'Medications',
    scheduled: 'Scheduled',
    prn: 'PRN',
    administered: 'Administered',
    lastUpdated: 'Last updated:',
    minutesAgo: 'minutes ago',
    safetyVerificationActive: 'Safety verification active',
    recordAdministration: 'Record Administration',
    medicationAdministrationRecord: 'Medication Administration Record',
    selectPatientDescription: 'Select a patient from the list on the left to view and administer medications with enhanced safety verification.'
  },
  pt: {
    medicationAdministration: 'Administração de Medicamentos',
    enhancedSafety: 'Segurança aprimorada com scanner e verificação',
    scanMode: 'Modo de Scanner',
    exitScanMode: 'Sair do Modo de Scanner',
    reports: 'Relatórios',
    patients: 'Pacientes',
    medicationsDue: 'medicamentos devidos',
    selectPatientToViewMedications: 'Selecione um paciente para visualizar os medicamentos',
    searchPatients: 'Buscar pacientes...',
    name: 'Nome',
    mrn: 'Prontuário',
    room: 'Quarto',
    due: 'Devido',
    medications: 'Medicamentos',
    scheduled: 'Agendado',
    prn: 'SOS',
    administered: 'Administrado',
    lastUpdated: 'Última atualização:',
    minutesAgo: 'minutos atrás',
    safetyVerificationActive: 'Verificação de segurança ativa',
    recordAdministration: 'Registrar Administração',
    medicationAdministrationRecord: 'Registro de Administração de Medicamentos',
    selectPatientDescription: 'Selecione um paciente da lista à esquerda para visualizar e administrar medicamentos com verificação aprimorada de segurança.'
  }
};

export type MedicationsTranslationKey = keyof typeof medicationsTranslations.en;

export default medicationsTranslations;
