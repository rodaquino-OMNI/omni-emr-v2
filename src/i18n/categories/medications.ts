
export type MedicationsTranslationKey =
  | 'prescribeMedication'
  | 'medicationName'
  | 'dosage'
  | 'frequency'
  | 'startDate'
  | 'endDate'
  | 'joinCall';

export const medicationsTranslations = {
  pt: {
    prescribeMedication: 'Prescrever Medicamento',
    medicationName: 'Nome do Medicamento',
    dosage: 'Dosagem',
    frequency: 'Frequência',
    startDate: 'Data de Início',
    endDate: 'Data de Término',
    joinCall: 'Entrar na Chamada'
  },
  en: {
    prescribeMedication: 'Prescribe Medication',
    medicationName: 'Medication Name',
    dosage: 'Dosage',
    frequency: 'Frequency',
    startDate: 'Start Date',
    endDate: 'End Date',
    joinCall: 'Join Call'
  }
};
