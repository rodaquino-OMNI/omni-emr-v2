
import { TranslationCategories } from './categories';

// Define the translation key type based on all possible keys
export type TranslationKey = 
  | keyof typeof TranslationCategories.auth.en 
  | keyof typeof TranslationCategories.common.en
  | keyof typeof TranslationCategories.medications.en
  | keyof typeof TranslationCategories.patients.en
  | keyof typeof TranslationCategories.appointments.en
  | keyof typeof TranslationCategories.tasks.en
  | keyof typeof TranslationCategories.orders.en
  | keyof typeof TranslationCategories.medicalHistory.en
  | keyof typeof TranslationCategories.users.en
  // Additional vital signs related keys
  | 'vitals'
  | 'heartRate'
  | 'bloodPressure'
  | 'temperature'
  | 'oxygenSaturation'
  | 'respiratoryRate'
  | 'bloodGlucose'
  | 'painLevel'
  | 'systolic'
  | 'diastolic'
  | 'mmHg'
  | 'bpm'
  | 'breathsPerMinute'
  | 'noHistoricalUpdates'
  | 'loadingHistory'
  | 'filter'
  | 'recent'
  | 'recordVitals'
  | 'patients'
  | 'name'
  | 'mrn'
  | 'room'
  | 'selectPatientToViewVitals'
  | 'viewHistory'
  | 'print'
  | 'currentVitals'
  | 'trends'
  | 'insights'
  | 'timeRange'
  | 'noInsightsAvailable'
  | 'vitalSignsSummary'
  | 'abnormalValue'
  | 'abnormalDetected'
  | 'normalRange'
  | 'vitalSignsRecorded'
  | 'vitalSignsRecordedDescription';

// Define the translations for each language
export const translations = {
  en: {
    ...TranslationCategories.auth.en,
    ...TranslationCategories.common.en,
    ...TranslationCategories.medications.en,
    ...TranslationCategories.patients.en,
    ...TranslationCategories.appointments.en,
    ...TranslationCategories.tasks.en,
    ...TranslationCategories.orders.en,
    ...TranslationCategories.medicalHistory.en,
    ...TranslationCategories.users.en,
    // Add vital signs translations
    vitals: 'Vital Signs',
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    temperature: 'Temperature',
    oxygenSaturation: 'Oxygen Saturation',
    respiratoryRate: 'Respiratory Rate',
    bloodGlucose: 'Blood Glucose',
    painLevel: 'Pain Level',
    systolic: 'Systolic',
    diastolic: 'Diastolic',
    mmHg: 'mmHg',
    bpm: 'bpm',
    breathsPerMinute: 'breaths/min',
    noHistoricalUpdates: 'No historical updates available',
    loadingHistory: 'Loading history...',
    filter: 'Filter',
    recent: 'Recent',
    recordVitals: 'Record Vitals',
    patients: 'Patients',
    name: 'Name',
    mrn: 'MRN',
    room: 'Room',
    selectPatientToViewVitals: 'Select a patient to view vital signs',
    viewHistory: 'View History',
    print: 'Print',
    currentVitals: 'Current',
    trends: 'Trends',
    insights: 'Insights',
    timeRange: 'Time Range',
    noInsightsAvailable: 'No AI insights available for this patient',
    vitalSignsSummary: 'Vital Signs Summary',
    abnormalValue: 'Abnormal value',
    abnormalDetected: 'Abnormal',
    normalRange: 'Normal range',
    vitalSignsRecorded: 'Vital signs recorded',
    vitalSignsRecordedDescription: 'Patient vital signs have been successfully recorded'
  },
  pt: {
    ...TranslationCategories.auth.pt,
    ...TranslationCategories.common.pt,
    ...TranslationCategories.medications.pt,
    ...TranslationCategories.patients.pt,
    ...TranslationCategories.appointments.pt,
    ...TranslationCategories.tasks.pt,
    ...TranslationCategories.orders.pt,
    ...TranslationCategories.medicalHistory.pt,
    ...TranslationCategories.users.pt,
    // Add Portuguese translations for vital signs
    vitals: 'Sinais Vitais',
    heartRate: 'Frequência Cardíaca',
    bloodPressure: 'Pressão Arterial',
    temperature: 'Temperatura',
    oxygenSaturation: 'Saturação de Oxigênio',
    respiratoryRate: 'Frequência Respiratória',
    bloodGlucose: 'Glicemia',
    painLevel: 'Nível de Dor',
    systolic: 'Sistólica',
    diastolic: 'Diastólica',
    mmHg: 'mmHg',
    bpm: 'bpm',
    breathsPerMinute: 'resp/min',
    noHistoricalUpdates: 'Sem atualizações históricas disponíveis',
    loadingHistory: 'Carregando histórico...',
    filter: 'Filtrar',
    recent: 'Recentes',
    recordVitals: 'Registrar Sinais',
    patients: 'Pacientes',
    name: 'Nome',
    mrn: 'Registro',
    room: 'Quarto',
    selectPatientToViewVitals: 'Selecione um paciente para ver os sinais vitais',
    viewHistory: 'Ver Histórico',
    print: 'Imprimir',
    currentVitals: 'Atual',
    trends: 'Tendências',
    insights: 'Análises',
    timeRange: 'Período',
    noInsightsAvailable: 'Sem análises de IA disponíveis para este paciente',
    vitalSignsSummary: 'Resumo dos Sinais Vitais',
    abnormalValue: 'Valor anormal',
    abnormalDetected: 'Anormal',
    normalRange: 'Faixa normal',
    vitalSignsRecorded: 'Sinais vitais registrados',
    vitalSignsRecordedDescription: 'Os sinais vitais do paciente foram registrados com sucesso'
  }
};
