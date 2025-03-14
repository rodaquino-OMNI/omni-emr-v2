
export type VitalsTranslationKey =
  | 'vitals'
  | 'currentVitals'
  | 'trends'
  | 'insights'
  | 'heartRate'
  | 'bloodPressure'
  | 'temperature'
  | 'oxygenSaturation'
  | 'respiratoryRate'
  | 'bloodGlucose'
  | 'painLevel'
  | 'bpm'
  | 'mmHg'
  | 'breathsPerMinute'
  | 'vitalSignsSummary'
  | 'noInsightsAvailable'
  | 'vitalSignsRecorded'
  | 'vitalSignsRecordedDescription'
  | 'recordVitals'
  | 'viewHistory'
  | 'print'
  | 'timeRange'
  | 'abnormalDetected'
  | 'abnormalValue'
  | 'normalRange'
  | 'systolic'
  | 'diastolic'
  | 'filter'
  | 'recent'
  | 'selectPatientToViewVitals'
  | 'room'
  | 'mrn'
  | 'normal'
  | 'loadingInsights'
  | 'lastRecordedTime'
  | 'errorRecordingVitals'
  | 'errorRecordingVitalsDescription'
  | 'patients';

export const vitalsTranslations = {
  pt: {
    vitals: 'Sinais Vitais',
    currentVitals: 'Sinais Vitais Atuais',
    trends: 'Tendências',
    insights: 'Insights',
    heartRate: 'Frequência Cardíaca',
    bloodPressure: 'Pressão Arterial',
    temperature: 'Temperatura',
    oxygenSaturation: 'Saturação de Oxigênio',
    respiratoryRate: 'Frequência Respiratória',
    bloodGlucose: 'Glicemia',
    painLevel: 'Nível de Dor',
    bpm: 'bpm',
    mmHg: 'mmHg',
    breathsPerMinute: 'resp/min',
    vitalSignsSummary: 'Resumo dos Sinais Vitais',
    noInsightsAvailable: 'Nenhuma análise disponível para este paciente',
    vitalSignsRecorded: 'Sinais vitais registrados',
    vitalSignsRecordedDescription: 'Os sinais vitais do paciente foram registrados com sucesso',
    recordVitals: 'Registrar Sinais Vitais',
    viewHistory: 'Ver Histórico',
    print: 'Imprimir',
    timeRange: 'Período',
    abnormalDetected: 'Anormal detectado',
    abnormalValue: 'Valor anormal',
    normalRange: 'Faixa normal',
    systolic: 'Sistólica',
    diastolic: 'Diastólica',
    filter: 'Filtrar',
    recent: 'Recentes',
    selectPatientToViewVitals: 'Selecione um paciente para visualizar os sinais vitais',
    room: 'Quarto',
    mrn: 'MRN',
    normal: 'Normal',
    loadingInsights: 'Carregando análises...',
    lastRecordedTime: 'Último registro há {time}',
    errorRecordingVitals: 'Erro ao registrar sinais vitais',
    errorRecordingVitalsDescription: 'Ocorreu um erro ao registrar os sinais vitais do paciente',
    patients: 'Pacientes'
  },
  en: {
    vitals: 'Vital Signs',
    currentVitals: 'Current Vitals',
    trends: 'Trends',
    insights: 'Insights',
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    temperature: 'Temperature',
    oxygenSaturation: 'Oxygen Saturation',
    respiratoryRate: 'Respiratory Rate',
    bloodGlucose: 'Blood Glucose',
    painLevel: 'Pain Level',
    bpm: 'bpm',
    mmHg: 'mmHg',
    breathsPerMinute: 'breaths/min',
    vitalSignsSummary: 'Vital Signs Summary',
    noInsightsAvailable: 'No insights available for this patient',
    vitalSignsRecorded: 'Vital signs recorded',
    vitalSignsRecordedDescription: 'Patient\'s vital signs have been successfully recorded',
    recordVitals: 'Record Vitals',
    viewHistory: 'View History',
    print: 'Print',
    timeRange: 'Time Range',
    abnormalDetected: 'Abnormal detected',
    abnormalValue: 'Abnormal value',
    normalRange: 'Normal range',
    systolic: 'Systolic',
    diastolic: 'Diastolic',
    filter: 'Filter',
    recent: 'Recent',
    selectPatientToViewVitals: 'Select a patient to view vital signs',
    room: 'Room',
    mrn: 'MRN',
    normal: 'Normal',
    loadingInsights: 'Loading insights...',
    lastRecordedTime: 'Last recorded {time}',
    errorRecordingVitals: 'Error recording vital signs',
    errorRecordingVitalsDescription: 'There was an error recording the patient\'s vital signs',
    patients: 'Patients'
  }
};
