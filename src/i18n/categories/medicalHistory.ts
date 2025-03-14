
export type MedicalHistoryTranslationKey =
  | 'medicalHistory'
  | 'pastMedicalHistory'
  | 'allergies'
  | 'currentMedications'
  | 'familyHistory'
  | 'socialHistory'
  | 'chiefComplaint'
  | 'historyOfPresentIllness'
  | 'reviewOfSystems'
  | 'immunizations'
  | 'labResults'
  | 'addNewEntry'
  | 'editEntry'
  | 'deleteEntry'
  | 'viewHistory'
  | 'finding'
  | 'notes'
  | 'date'
  | 'provider'
  | 'actions'
  | 'noDataAvailable'
  | 'loadingHistory'
  | 'noHistoricalUpdates'
  | 'hipaaComplianceTitle'
  | 'hipaaComplianceDescription';

export const medicalHistoryTranslations = {
  en: {
    medicalHistory: 'Medical History',
    pastMedicalHistory: 'Past Medical History',
    allergies: 'Allergies',
    currentMedications: 'Current Medications',
    familyHistory: 'Family History',
    socialHistory: 'Social History',
    chiefComplaint: 'Chief Complaint',
    historyOfPresentIllness: 'History of Present Illness',
    reviewOfSystems: 'Review of Systems',
    immunizations: 'Immunizations',
    labResults: 'Lab Results',
    addNewEntry: 'Add New Entry',
    editEntry: 'Edit Entry',
    deleteEntry: 'Delete Entry',
    viewHistory: 'View History',
    finding: 'Finding',
    notes: 'Notes',
    date: 'Date',
    provider: 'Provider',
    actions: 'Actions',
    noDataAvailable: 'No data available',
    loadingHistory: 'Loading history...',
    noHistoricalUpdates: 'No historical updates',
    hipaaComplianceTitle: 'HIPAA Compliant',
    hipaaComplianceDescription: 'This medical history is protected by HIPAA regulations'
  },
  pt: {
    medicalHistory: 'Histórico Médico',
    pastMedicalHistory: 'Histórico Médico Passado',
    allergies: 'Alergias',
    currentMedications: 'Medicações Atuais',
    familyHistory: 'Histórico Familiar',
    socialHistory: 'Histórico Social',
    chiefComplaint: 'Queixa Principal',
    historyOfPresentIllness: 'História da Doença Atual',
    reviewOfSystems: 'Revisão de Sistemas',
    immunizations: 'Imunizações',
    labResults: 'Resultados de Exames',
    addNewEntry: 'Adicionar Nova Entrada',
    editEntry: 'Editar Entrada',
    deleteEntry: 'Excluir Entrada',
    viewHistory: 'Ver Histórico',
    finding: 'Achado',
    notes: 'Notas',
    date: 'Data',
    provider: 'Profissional',
    actions: 'Ações',
    noDataAvailable: 'Nenhum dado disponível',
    loadingHistory: 'Carregando histórico...',
    noHistoricalUpdates: 'Sem atualizações históricas',
    hipaaComplianceTitle: 'Em Conformidade com HIPAA',
    hipaaComplianceDescription: 'Este histórico médico é protegido pelas regulamentações HIPAA'
  }
};
