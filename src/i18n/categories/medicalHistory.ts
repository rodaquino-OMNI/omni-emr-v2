
export type MedicalHistoryTranslationKey =
  | 'noHistoricalUpdates'
  | 'loadingHistory'
  | 'hipaaComplianceTitle'
  | 'hipaaComplianceDescription'
  | 'viewMedicalHistory'
  | 'exportMedicalHistory'
  | 'printMedicalHistory'
  | 'historicalEvents'
  | 'timelineView'
  | 'categoryView'
  | 'allCategories'
  | 'medications'
  | 'procedures'
  | 'diagnoses'
  | 'labResults'
  | 'vitalSigns'
  | 'imaging'
  | 'allergies';

export const medicalHistoryTranslations = {
  pt: {
    noHistoricalUpdates: 'Nenhuma atualização histórica encontrada para este paciente.',
    loadingHistory: 'Carregando histórico...',
    hipaaComplianceTitle: 'Conformidade HIPAA e Segurança',
    hipaaComplianceDescription: 'Este sistema de registros médicos segue os padrões FHIR e requisitos de segurança HIPAA. Todo acesso a estes dados é registrado e criptografado para segurança do paciente.',
    viewMedicalHistory: 'Ver histórico médico',
    exportMedicalHistory: 'Exportar histórico médico',
    printMedicalHistory: 'Imprimir histórico médico',
    historicalEvents: 'Eventos históricos',
    timelineView: 'Visualização de linha do tempo',
    categoryView: 'Visualização por categoria',
    allCategories: 'Todas as categorias',
    medications: 'Medicamentos',
    procedures: 'Procedimentos',
    diagnoses: 'Diagnósticos',
    labResults: 'Resultados de laboratório',
    vitalSigns: 'Sinais vitais',
    imaging: 'Imagens',
    allergies: 'Alergias'
  },
  en: {
    noHistoricalUpdates: 'No historical updates found for this patient.',
    loadingHistory: 'Loading history...',
    hipaaComplianceTitle: 'HIPAA Compliance & Security',
    hipaaComplianceDescription: 'This medical record system follows FHIR standards and HIPAA security requirements. All access to this data is logged and encrypted for patient safety.',
    viewMedicalHistory: 'View medical history',
    exportMedicalHistory: 'Export medical history',
    printMedicalHistory: 'Print medical history',
    historicalEvents: 'Historical events',
    timelineView: 'Timeline view',
    categoryView: 'Category view',
    allCategories: 'All categories',
    medications: 'Medications',
    procedures: 'Procedures',
    diagnoses: 'Diagnoses',
    labResults: 'Lab results',
    vitalSigns: 'Vital signs',
    imaging: 'Imaging',
    allergies: 'Allergies'
  }
};
