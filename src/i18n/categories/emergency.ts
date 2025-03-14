
interface EmergencyTranslations {
  // Emergency department
  emergencyCare: string;
  emergencyDepartment: string;
  emergencyTriage: string;
  registerNewPatient: string;
  
  // Patient information
  patient: string;
  patientId: string;
  patientInformation: string;
  chiefComplaint: string;
  enterChiefComplaint: string;
  
  // Triage levels
  triage: string;
  wait: string;
  arrivalTime: string;
  immediate: string;
  emergent: string;
  urgent: string;
  semiUrgent: string;
  nonUrgent: string;
  notTriaged: string;
  
  // Vital signs
  vitalSigns: string;
  updateVitals: string;
  heartRate: string;
  respiratoryRate: string;
  bloodPressure: string;
  temperature: string;
  painLevel: string;
  oxygenSaturation: string;
  
  // Triage workflow
  assignTriageLevel: string;
  currentTriageLevel: string;
  triageTimestamp: string;
  triageLevelAssigned: string;
  patientHasBeenTriaged: string;
  
  // Treatment
  emergencyTreatment: string;
  initiateTreatment: string;
  orderEmergencyDiagnostics: string;
  triageRequired: string;
  mustAssignTriageLevelFirst: string;
  treatmentInitiated: string;
  emergencyTreatmentStarted: string;
  vitalSignsRecorded: string;
  vitalSignsUpdated: string;
  noEmergencyCarePermissions: string;
  selectPatientToViewEmergencyCare: string;
}

export type EmergencyTranslationKey = keyof EmergencyTranslations;

export const emergencyTranslations = {
  en: {
    // Emergency department
    emergencyCare: "Emergency Care",
    emergencyDepartment: "Emergency Department",
    emergencyTriage: "Emergency Triage",
    registerNewPatient: "Register New Patient",
    
    // Patient information
    patient: "Patient",
    patientId: "Patient ID",
    patientInformation: "Patient Information",
    chiefComplaint: "Chief Complaint",
    enterChiefComplaint: "Enter chief complaint",
    
    // Triage levels
    triage: "Triage",
    wait: "Wait",
    arrivalTime: "Arrival Time",
    immediate: "Immediate",
    emergent: "Emergent",
    urgent: "Urgent",
    semiUrgent: "Semi-Urgent",
    nonUrgent: "Non-Urgent",
    notTriaged: "Not Triaged",
    
    // Vital signs
    vitalSigns: "Vital Signs",
    updateVitals: "Update Vitals",
    heartRate: "Heart Rate",
    respiratoryRate: "Respiratory Rate",
    bloodPressure: "Blood Pressure",
    temperature: "Temperature",
    painLevel: "Pain Level",
    oxygenSaturation: "Oxygen Saturation",
    
    // Triage workflow
    assignTriageLevel: "Assign Triage Level",
    currentTriageLevel: "Current Triage Level",
    triageTimestamp: "Triage Timestamp",
    triageLevelAssigned: "Triage Level Assigned",
    patientHasBeenTriaged: "Patient has been triaged",
    
    // Treatment
    emergencyTreatment: "Emergency Treatment",
    initiateTreatment: "Initiate Treatment",
    orderEmergencyDiagnostics: "Order Emergency Diagnostics",
    triageRequired: "Triage Required",
    mustAssignTriageLevelFirst: "You must assign a triage level first",
    treatmentInitiated: "Treatment Initiated",
    emergencyTreatmentStarted: "Emergency treatment has been started",
    vitalSignsRecorded: "Vital Signs Recorded",
    vitalSignsUpdated: "Vital signs have been updated",
    noEmergencyCarePermissions: "You don't have permissions to perform emergency care actions",
    selectPatientToViewEmergencyCare: "Select a patient to view emergency care"
  },
  pt: {
    // Emergency department
    emergencyCare: "Atendimento de Emergência",
    emergencyDepartment: "Departamento de Emergência",
    emergencyTriage: "Triagem de Emergência",
    registerNewPatient: "Registrar Novo Paciente",
    
    // Patient information
    patient: "Paciente",
    patientId: "ID do Paciente",
    patientInformation: "Informações do Paciente",
    chiefComplaint: "Queixa Principal",
    enterChiefComplaint: "Digite a queixa principal",
    
    // Triage levels
    triage: "Triagem",
    wait: "Espera",
    arrivalTime: "Hora de Chegada",
    immediate: "Imediato",
    emergent: "Emergente",
    urgent: "Urgente",
    semiUrgent: "Semi-Urgente",
    nonUrgent: "Não Urgente",
    notTriaged: "Não Triado",
    
    // Vital signs
    vitalSigns: "Sinais Vitais",
    updateVitals: "Atualizar Sinais Vitais",
    heartRate: "Frequência Cardíaca",
    respiratoryRate: "Frequência Respiratória",
    bloodPressure: "Pressão Arterial",
    temperature: "Temperatura",
    painLevel: "Nível de Dor",
    oxygenSaturation: "Saturação de Oxigênio",
    
    // Triage workflow
    assignTriageLevel: "Atribuir Nível de Triagem",
    currentTriageLevel: "Nível de Triagem Atual",
    triageTimestamp: "Horário da Triagem",
    triageLevelAssigned: "Nível de Triagem Atribuído",
    patientHasBeenTriaged: "Paciente foi triado",
    
    // Treatment
    emergencyTreatment: "Tratamento de Emergência",
    initiateTreatment: "Iniciar Tratamento",
    orderEmergencyDiagnostics: "Solicitar Diagnósticos de Emergência",
    triageRequired: "Triagem Necessária",
    mustAssignTriageLevelFirst: "Você deve atribuir um nível de triagem primeiro",
    treatmentInitiated: "Tratamento Iniciado",
    emergencyTreatmentStarted: "O tratamento de emergência foi iniciado",
    vitalSignsRecorded: "Sinais Vitais Registrados",
    vitalSignsUpdated: "Os sinais vitais foram atualizados",
    noEmergencyCarePermissions: "Você não tem permissões para realizar ações de atendimento de emergência",
    selectPatientToViewEmergencyCare: "Selecione um paciente para ver o atendimento de emergência"
  }
};
