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
    
    // RxNorm integration
    searchRxNorm: "Search Medication Database",
    noMedicationsFound: "No medications found",
    searchByName: "Search by name",
    searchByCode: "Search by code",
    rxnormCode: "RxNorm Code",
    anvisaCode: "ANVISA Code",
    ingredientStrength: "Ingredient Strength",
    dosageForm: "Dosage Form",
    brandName: "Brand Name",
    genericName: "Generic Name",
    selectMedication: "Select Medication",
    medicationSelected: "Medication selected",
    syncRxNormData: "Sync Medication Data",
    lastSyncDate: "Last Sync Date",
    
    // Drug interaction related translations
    drugInteractions: "Drug Interactions",
    checkInteractions: "Check Interactions",
    noInteractionsFound: "No interactions found",
    interactionSeverity: "Severity",
    highSeverity: "High",
    moderateSeverity: "Moderate",
    lowSeverity: "Low",
    interactionDescription: "Description",
    addMedication: "Add Medication",
    selectedMedications: "Selected Medications",
    interactionsFound: "Interactions Found",
    interactionChecker: "Drug Interaction Checker",
    
    // NDC and drug details
    ndcCodes: "NDC Codes",
    autocompleteResults: "Suggested Medications",
    spellingSuggestions: "Spelling Suggestions",
    didYouMean: "Did you mean",
    
    // Safety-related translations
    medicationSafety: "Medication Safety",
    allergyWarning: "Allergy Warning",
    allergyWarningDescription: "This medication may cause an allergic reaction based on patient's recorded allergies.",
    highRiskMedication: "High Risk Medication",
    highRiskMedicationWarning: "This is a high-risk medication that requires additional verification.",
    weightBasedDosing: "Weight-Based Dosing",
    weightBasedDosingRequired: "This medication requires current patient weight for proper dosing.",
    medicationContraindicated: "Medication Contraindicated",
    verifyAllergies: "Verify Allergies",
    allergiesNotReviewed: "Allergies have not been reviewed for this session",
    reviewAllergies: "Review Allergies",
    allergiesReviewed: "Allergies reviewed",
    proceedAnyway: "Proceed Anyway",
    acknowledgeAndProceed: "Acknowledge and Proceed",
    weightVerification: "Weight Verification",
    verifyPatientWeight: "Verify patient weight",
    patientWeight: "Patient Weight",
    lastUpdated: "Last Updated",
    updateWeight: "Update Weight",
    contraIndication: "Contraindication",
    possibleInteraction: "Possible Interaction",
    noKnownAllergies: "No Known Allergies",
    reviewComplete: "Review Complete",
    safetyCheckPassed: "Safety Check Passed",
    safetyCheckFailed: "Safety Check Failed",
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
    
    // RxNorm integration
    searchRxNorm: "Pesquisar Banco de Dados de Medicamentos",
    noMedicationsFound: "Nenhum medicamento encontrado",
    searchByName: "Pesquisar por nome",
    searchByCode: "Pesquisar por código",
    rxnormCode: "Código RxNorm",
    anvisaCode: "Código ANVISA",
    ingredientStrength: "Concentração do Ingrediente",
    dosageForm: "Forma Farmacêutica",
    brandName: "Nome Comercial",
    genericName: "Nome Genérico",
    selectMedication: "Selecionar Medicamento",
    medicationSelected: "Medicamento selecionado",
    syncRxNormData: "Sincronizar Dados de Medicamentos",
    lastSyncDate: "Última Data de Sincronização",
    
    // Drug interaction related translations
    drugInteractions: "Interações Medicamentosas",
    checkInteractions: "Verificar Interações",
    noInteractionsFound: "Nenhuma interação encontrada",
    interactionSeverity: "Gravidade",
    highSeverity: "Alta",
    moderateSeverity: "Moderada",
    lowSeverity: "Baixa",
    interactionDescription: "Descrição",
    addMedication: "Adicionar Medicamento",
    selectedMedications: "Medicamentos Selecionados",
    interactionsFound: "Interações Encontradas",
    interactionChecker: "Verificador de Interações Medicamentosas",
    
    // NDC and drug details
    ndcCodes: "Códigos NDC",
    autocompleteResults: "Medicamentos Sugeridos",
    spellingSuggestions: "Sugestões de Ortografia",
    didYouMean: "Você quis dizer",
    
    // Safety-related translations
    medicationSafety: "Segurança Medicamentosa",
    allergyWarning: "Alerta de Alergia",
    allergyWarningDescription: "Este medicamento pode causar uma reação alérgica com base nas alergias registradas do paciente.",
    highRiskMedication: "Medicamento de Alto Risco",
    highRiskMedicationWarning: "Este é um medicamento de alto risco que requer verificação adicional.",
    weightBasedDosing: "Dosagem Baseada no Peso",
    weightBasedDosingRequired: "Este medicamento requer o peso atual do paciente para dosagem adequada.",
    medicationContraindicated: "Medicamento Contraindicado",
    verifyAllergies: "Verificar Alergias",
    allergiesNotReviewed: "As alergias não foram revisadas para esta sessão",
    reviewAllergies: "Revisar Alergias",
    allergiesReviewed: "Alergias revisadas",
    proceedAnyway: "Continuar Mesmo Assim",
    acknowledgeAndProceed: "Reconhecer e Continuar",
    weightVerification: "Verificação de Peso",
    verifyPatientWeight: "Verificar peso do paciente",
    patientWeight: "Peso do Paciente",
    lastUpdated: "Última Atualização",
    updateWeight: "Atualizar Peso",
    contraIndication: "Contraindicação",
    possibleInteraction: "Possível Interação",
    noKnownAllergies: "Sem Alergias Conhecidas",
    reviewComplete: "Revisão Completa",
    safetyCheckPassed: "Verificação de Segurança Aprovada",
    safetyCheckFailed: "Verificação de Segurança Falhou",
  }
};
