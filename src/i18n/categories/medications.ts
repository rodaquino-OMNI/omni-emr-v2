
export type MedicationsTranslationKey =
  | 'medication'
  | 'medications'
  | 'dosage'
  | 'route'
  | 'frequency'
  | 'startDate'
  | 'endDate'
  | 'addMedication'
  | 'editMedication'
  | 'viewMedication'
  | 'deleteMedication'
  | 'medicationDetails'
  | 'medicationAdministration'
  | 'viewOnlyMedicationAdministration'
  | 'administerMedication'
  | 'medicationHistory'
  | 'administer'
  | 'administeredBy'
  | 'administeredAt'
  | 'administrationDate'
  | 'administrationTime'
  | 'administrationNotes'
  | 'scanPatient'
  | 'scanMedication'
  | 'verifyPatientAndMedication'
  | 'allergyWarning'
  | 'patientHasAllergy'
  | 'medicationCode'
  | 'patientId'
  | 'enterPatientIdOrMRN'
  | 'enterPatientIdOrMRNHint'
  | 'enterMedicationBarcode'
  | 'enterMedicationBarcodeHint'
  | 'verifyIDs'
  | 'documentMissedDose'
  | 'reasonMissed'
  | 'enterReasonMissed'
  | 'confirm';

export const medicationsTranslations = {
  pt: {
    medication: 'Medicamento',
    medications: 'Medicamentos',
    dosage: 'Dosagem',
    route: 'Via',
    frequency: 'Frequência',
    startDate: 'Data de Início',
    endDate: 'Data de Término',
    addMedication: 'Adicionar Medicamento',
    editMedication: 'Editar Medicamento',
    viewMedication: 'Ver Medicamento',
    deleteMedication: 'Excluir Medicamento',
    medicationDetails: 'Detalhes do Medicamento',
    medicationAdministration: 'Administração de Medicamento',
    viewOnlyMedicationAdministration: 'Você está no modo de visualização apenas. Não é possível administrar medicamentos.',
    administerMedication: 'Administrar Medicamento',
    medicationHistory: 'Histórico de Medicamento',
    administer: 'Administrar',
    administeredBy: 'Administrado por',
    administeredAt: 'Administrado em',
    administrationDate: 'Data de Administração',
    administrationTime: 'Hora de Administração',
    administrationNotes: 'Notas de Administração',
    scanPatient: 'Escanear Paciente',
    scanMedication: 'Escanear Medicamento',
    verifyPatientAndMedication: 'Verificar Paciente e Medicamento',
    allergyWarning: 'Alerta de Alergia',
    patientHasAllergy: 'O paciente pode ter alergia a este medicamento. Verifique antes de administrar.',
    medicationCode: 'Código do Medicamento',
    patientId: 'ID do Paciente',
    enterPatientIdOrMRN: 'Digite o ID ou MRN do paciente',
    enterPatientIdOrMRNHint: 'Insira o identificador único do paciente',
    enterMedicationBarcode: 'Digite o código de barras do medicamento',
    enterMedicationBarcodeHint: 'Insira o código do medicamento na embalagem',
    verifyIDs: 'Verificar IDs',
    documentMissedDose: 'Documentar Dose Não Administrada',
    reasonMissed: 'Motivo da Não Administração',
    enterReasonMissed: 'Digite o motivo pelo qual a dose não foi administrada',
    confirm: 'Confirmar'
  },
  en: {
    medication: 'Medication',
    medications: 'Medications',
    dosage: 'Dosage',
    route: 'Route',
    frequency: 'Frequency',
    startDate: 'Start Date',
    endDate: 'End Date',
    addMedication: 'Add Medication',
    editMedication: 'Edit Medication',
    viewMedication: 'View Medication',
    deleteMedication: 'Delete Medication',
    medicationDetails: 'Medication Details',
    medicationAdministration: 'Medication Administration',
    viewOnlyMedicationAdministration: 'You are in view-only mode. You cannot administer medications.',
    administerMedication: 'Administer Medication',
    medicationHistory: 'Medication History',
    administer: 'Administer',
    administeredBy: 'Administered By',
    administeredAt: 'Administered At',
    administrationDate: 'Administration Date',
    administrationTime: 'Administration Time',
    administrationNotes: 'Administration Notes',
    scanPatient: 'Scan Patient',
    scanMedication: 'Scan Medication',
    verifyPatientAndMedication: 'Verify Patient and Medication',
    allergyWarning: 'Allergy Warning',
    patientHasAllergy: 'Patient may be allergic to this medication. Please verify before administering.',
    medicationCode: 'Medication Code',
    patientId: 'Patient ID',
    enterPatientIdOrMRN: 'Enter patient ID or MRN',
    enterPatientIdOrMRNHint: 'Input the patient\'s unique identifier',
    enterMedicationBarcode: 'Enter medication barcode',
    enterMedicationBarcodeHint: 'Input the code from the medication package',
    verifyIDs: 'Verify IDs',
    documentMissedDose: 'Document Missed Dose',
    reasonMissed: 'Reason Missed',
    enterReasonMissed: 'Enter reason why dose was not administered',
    confirm: 'Confirm'
  }
};
