
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
  
  // Add missing key
  prescribeMedication: string;
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
    
    // Add missing key
    prescribeMedication: "Prescribe Medication"
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
    
    // Add missing key
    prescribeMedication: "Prescrever Medicamento"
  }
};
