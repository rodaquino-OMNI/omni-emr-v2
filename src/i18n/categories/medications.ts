interface MedicationsTranslations {
  // Add common medication-related translations
  medications: string; // Plural
  medication: string; // Singular
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate: string;
  instructions: string;
  prescriber: string;
  pharmacy: string;
  refills: string;
  lastRefill: string;
  status: string;
  active: string;
  inactive: string;
  discontinued: string;
  onHold: string;
  
  // Administration-related translations
  medicationAdministrationRecord: string;
  scheduledTime: string;
  administered: string;
  scheduled: string;
  missed: string;
  held: string;
  administeredBy: string;
  administeredAt: string;
  administer: string;
  hold: string;
  recordAdministration: string;
  details: string;
  actions: string;
  permissionDenied: string;
  cannotAdministerMedications: string;
  medicationAdministered: string;
  medicationAdministrationRecorded: string;
  medicationHeld: string;
  medicationMarkedAsHeld: string;
  viewOnlyMedicationAdministration: string;
  featureNotImplemented: string;
  medicationAdministrationFormWouldOpen: string;
  medicationAdministration: string;
  selectPatientToViewMedications: string;
  
  // RxNorm integration
  searchRxNorm: string;
  noMedicationsFound: string;
  searchByName: string;
  searchByCode: string;
  rxnormCode: string;
  anvisaCode: string;
  ingredientStrength: string;
  dosageForm: string;
  brandName: string;
  genericName: string;
  selectMedication: string;
  medicationSelected: string;
  syncRxNormData: string;
  lastSyncDate: string;
  
  // Drug interaction related translations
  drugInteractions: string;
  checkInteractions: string;
  noInteractionsFound: string;
  interactionSeverity: string;
  highSeverity: string;
  moderateSeverity: string;
  lowSeverity: string;
  interactionDescription: string;
  addMedication: string;
  selectedMedications: string;
  interactionsFound: string;
  interactionChecker: string;
  
  // NDC and drug details
  ndcCodes: string;
  autocompleteResults: string;
  spellingSuggestions: string;
  didYouMean: string;
  
  // Safety-related translations
  medicationSafety: string;
  allergyWarning: string;
  allergyWarningDescription: string;
  highRiskMedication: string;
  highRiskMedicationWarning: string;
  weightBasedDosing: string;
  weightBasedDosingRequired: string;
  medicationContraindicated: string;
  verifyAllergies: string;
  allergiesNotReviewed: string;
  reviewAllergies: string;
  allergiesReviewed: string;
  proceedAnyway: string;
  acknowledgeAndProceed: string;
  weightVerification: string;
  verifyPatientWeight: string;
  patientWeight: string;
  lastUpdated: string;
  updateWeight: string;
  contraIndication: string;
  possibleInteraction: string;
  noKnownAllergies: string;
  reviewComplete: string;
  safetyCheckPassed: string;
  safetyCheckFailed: string;
}

export type MedicationsTranslationKey = keyof MedicationsTranslations;

export const medicationsTranslations = {
  en: {
    medications: "Medications",
    medication: "Medication",
    dosage: "Dosage",
    frequency: "Frequency",
    route: "Route",
    startDate: "Start Date",
    endDate: "End Date",
    instructions: "Instructions",
    prescriber: "Prescriber",
    pharmacy: "Pharmacy",
    refills: "Refills",
    lastRefill: "Last Refill",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    discontinued: "Discontinued",
    onHold: "On Hold",
    
    // Administration-related translations
    medicationAdministrationRecord: "Medication Administration Record",
    scheduledTime: "Scheduled Time",
    administered: "Administered",
    scheduled: "Scheduled",
    missed: "Missed",
    held: "Held",
    administeredBy: "Administered By",
    administeredAt: "Administered At",
    administer: "Administer",
    hold: "Hold",
    recordAdministration: "Record Administration",
    details: "Details",
    actions: "Actions",
    permissionDenied: "Permission Denied",
    cannotAdministerMedications: "You don't have permission to administer medications",
    medicationAdministered: "Medication Administered",
    medicationAdministrationRecorded: "Medication administration has been recorded",
    medicationHeld: "Medication Held",
    medicationMarkedAsHeld: "Medication has been marked as held",
    viewOnlyMedicationAdministration: "You have view-only access to medication administration records",
    featureNotImplemented: "Feature Not Implemented",
    medicationAdministrationFormWouldOpen: "In a real application, a medication administration form would open",
    medicationAdministration: "Medication Administration",
    selectPatientToViewMedications: "Select a patient to view their medications",
    
    // New translations for medication safety enhancement
    todaySchedule: "Today's Schedule",
    medicationSafety: "Medication Safety",
    patientIdentification: "Patient Identification",
    verifyPatient: "Verify Patient",
    verifyMedication: "Verify Medication",
    scanPatient: "Scan Patient",
    scanMedication: "Scan Medication",
    patientScanned: "Patient Scanned",
    medicationScanned: "Medication Scanned",
    scanBarcode: "Scan Barcode",
    manualEntry: "Manual Entry",
    scanComplete: "Scan Complete",
    scanning: "Scanning...",
    medicationVerification: "Medication Verification",
    patientId: "Patient ID",
    medicationCode: "Medication Code",
    enterPatientId: "Enter patient ID manually",
    enterMedicationCode: "Enter medication code manually",
    submitCodes: "Submit Codes",
    confirmAdministration: "Confirm Administration",
    allergyWarning: "Allergy Warning",
    patientHasAllergy: "Patient has a recorded allergy to this medication",
    cameraScanPlaceholder: "Camera would activate here for barcode scanning",
    legend: "Legend",
    type: "Type",
    antibiotic: "Antibiotic",
    analgesic: "Analgesic",
    critical: "Critical",
    prn: "PRN",
    regular: "Regular",
    mrn: "MRN",
    room: "Room",
    allergies: "Allergies",
    administrationDetails: "Administration Details",
    by: "By",
    at: "At",
    notes: "Notes",
    documentMissedDose: "Document Missed Dose",
    reasonMissed: "Reason Missed",
    enterReasonMissed: "Enter reason this dose was missed",
    cancel: "Cancel",
    confirm: "Confirm",
    medicationMissed: "Medication Missed",
    missedDoseDocumented: "Missed dose has been documented",
    scanningInstructions: "Position the barcode in the camera view",
    verificationFailed: "Verification Failed",
    scanBothPatientAndMedication: "Please scan both patient and medication",
    ivCalculator: "IV Calculator",
    totalVolume: "Total Volume",
    concentration: "Concentration",
    flowRate: "Flow Rate",
    infusionDuration: "Infusion Duration",
    patientWeight: "Patient Weight",
    weightBasedCalculation: "Weight-Based Calculation",
    dosePerKg: "Dose per kg",
    calculationSummary: "Calculation Summary",
    totalDose: "Total Dose",
    saveSettings: "Save Settings",
    ivRate: "IV Rate",
    ivDetails: "IV Details",
    rate: "Rate",
    duration: "Duration",
    ivRateUpdated: "IV Rate Updated",
    ivCalculationComplete: "IV calculation complete",
  },
  pt: {
    medications: "Medicamentos",
    medication: "Medicamento",
    dosage: "Dosagem",
    frequency: "Frequência",
    route: "Via",
    startDate: "Data de Início",
    endDate: "Data de Término",
    instructions: "Instruções",
    prescriber: "Prescritor",
    pharmacy: "Farmácia",
    refills: "Recargas",
    lastRefill: "Última Recarga",
    status: "Status",
    active: "Ativo",
    inactive: "Inativo",
    discontinued: "Descontinuado",
    onHold: "Em Espera",
    
    // Administration-related translations
    medicationAdministrationRecord: "Registro de Administração de Medicamentos",
    scheduledTime: "Horário Agendado",
    administered: "Administrado",
    scheduled: "Agendado",
    missed: "Perdido",
    held: "Suspenso",
    administeredBy: "Administrado Por",
    administeredAt: "Administrado Em",
    administer: "Administrar",
    hold: "Suspender",
    recordAdministration: "Registrar Administração",
    details: "Detalhes",
    actions: "Ações",
    permissionDenied: "Permissão Negada",
    cannotAdministerMedications: "Você não tem permissão para administrar medicamentos",
    medicationAdministered: "Medicamento Administrado",
    medicationAdministrationRecorded: "A administração do medicamento foi registrada",
    medicationHeld: "Medicamento Suspenso",
    medicationMarkedAsHeld: "O medicamento foi marcado como suspenso",
    viewOnlyMedicationAdministration: "Você tem acesso somente para visualização dos registros de administração de medicamentos",
    featureNotImplemented: "Funcionalidade Não Implementada",
    medicationAdministrationFormWouldOpen: "Em uma aplicação real, um formulário de administração de medicamentos seria aberto",
    medicationAdministration: "Administração de Medicamentos",
    selectPatientToViewMedications: "Selecione um paciente para ver seus medicamentos",
    
    // New translations for medication safety enhancement
    todaySchedule: "Programação de Hoje",
    medicationSafety: "Segurança Medicamentosa",
    patientIdentification: "Identificação do Paciente",
    verifyPatient: "Verificar Paciente",
    verifyMedication: "Verificar Medicamento",
    scanPatient: "Escanear Paciente",
    scanMedication: "Escanear Medicamento",
    patientScanned: "Paciente Escaneado",
    medicationScanned: "Medicamento Escaneado",
    scanBarcode: "Escanear Código de Barras",
    manualEntry: "Entrada Manual",
    scanComplete: "Escaneamento Completo",
    scanning: "Escaneando...",
    medicationVerification: "Verificação de Medicamento",
    patientId: "ID do Paciente",
    medicationCode: "Código do Medicamento",
    enterPatientId: "Digite o ID do paciente manualmente",
    enterMedicationCode: "Digite o código do medicamento manualmente",
    submitCodes: "Enviar Códigos",
    confirmAdministration: "Confirmar Administração",
    allergyWarning: "Alerta de Alergia",
    patientHasAllergy: "Paciente tem alergia registrada a este medicamento",
    cameraScanPlaceholder: "A câmera seria ativada aqui para leitura de código de barras",
    legend: "Legenda",
    type: "Tipo",
    antibiotic: "Antibiótico",
    analgesic: "Analgésico",
    critical: "Crítico",
    prn: "SN",
    regular: "Regular",
    mrn: "Registro",
    room: "Quarto",
    allergies: "Alergias",
    administrationDetails: "Detalhes da Administração",
    by: "Por",
    at: "Em",
    notes: "Notas",
    documentMissedDose: "Documentar Dose Perdida",
    reasonMissed: "Motivo Perdido",
    enterReasonMissed: "Insira o motivo pelo qual esta dose foi perdida",
    cancel: "Cancelar",
    confirm: "Confirmar",
    medicationMissed: "Medicamento Perdido",
    missedDoseDocumented: "Dose perdida foi documentada",
    scanningInstructions: "Posicione o código de barras na visão da câmera",
    verificationFailed: "Verificação Falhou",
    scanBothPatientAndMedication: "Por favor escaneie tanto o paciente quanto o medicamento",
    ivCalculator: "Calculadora IV",
    totalVolume: "Volume Total",
    concentration: "Concentração",
    flowRate: "Taxa de Fluxo",
    infusionDuration: "Duração da Infusão",
    patientWeight: "Peso do Paciente",
    weightBasedCalculation: "Cálculo Baseado no Peso",
    dosePerKg: "Dose por kg",
    calculationSummary: "Resumo do Cálculo",
    totalDose: "Dose Total",
    saveSettings: "Salvar Configurações",
    ivRate: "Taxa IV",
    ivDetails: "Detalhes IV",
    rate: "Taxa",
    duration: "Duração",
    ivRateUpdated: "Taxa IV Atualizada",
    ivCalculationComplete: "Cálculo IV completo",
  }
};
