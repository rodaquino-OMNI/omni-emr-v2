
export type HospitalTranslationKey =
  | 'hospitalWorkflows'
  | 'admission'
  | 'inpatientCare'
  | 'discharge'
  | 'inpatients'
  | 'inpatientCareManagement'
  | 'ongoingCare'
  | 'admissionProcess'
  | 'dischargeProcess'
  | 'createAdmissionOrders'
  | 'performAdmissionAssessment'
  | 'performMedicationReconciliation'
  | 'createDischargeOrders'
  | 'completeDischargeSummary'
  | 'physicianActions'
  | 'nursingActions'
  | 'nursingDischargeActions'
  | 'physicianDischargeActions'
  | 'createDischargeInstructions'
  | 'admissionOrdersDescription'
  | 'nursingAdmissionDescription'
  | 'dischargeOrdersDescription'
  | 'nursingDischargeDescription'
  | 'noAdmissionPermissions'
  | 'noDischargePermissions'
  | 'inpatientCareDescription'
  | 'viewClinicalDocumentation'
  | 'viewVitalSigns'
  | 'viewMedicationAdministration'
  | 'selectPatientToViewWorkflows'
  | 'admittedOn'
  | 'admissionOrderCreated'
  | 'admissionOrderForPatient'
  | 'admissionAssessmentStarted'
  | 'nursingAssessmentStarted'
  | 'medicationReconciliationStarted'
  | 'reviewingPatientMedications'
  | 'dischargeOrderCreated'
  | 'patientMarkedForDischarge'
  | 'dischargeSummaryStarted'
  | 'completingDischargeSummary'
  | 'dischargeInstructionsCreated'
  | 'patientEducationMaterialsCreated'
  | 'medicationAdministration'
  | 'medicationAdministrationRecord'
  | 'recordAdministration'
  | 'administered'
  | 'missed'
  | 'held'
  | 'scheduled'
  | 'scheduledTime'
  | 'administeredBy'
  | 'route'
  | 'administer'
  | 'hold'
  | 'details'
  | 'medicationAdministered'
  | 'medicationAdministrationRecorded'
  | 'medicationHeld'
  | 'medicationMarkedAsHeld'
  | 'permissionDenied'
  | 'cannotAdministerMedications'
  | 'viewOnlyMedicationAdministration'
  | 'selectPatientToViewMedications'
  | 'emergencyCare'
  | 'emergencyTriage'
  | 'emergencyDepartment'
  | 'registerNewPatient'
  | 'triage'
  | 'wait'
  | 'patientInformation'
  | 'chiefComplaint'
  | 'enterChiefComplaint'
  | 'vitalSigns'
  | 'updateVitals'
  | 'heartRate'
  | 'bloodPressure'
  | 'respiratoryRate'
  | 'temperature'
  | 'oxygenSaturation'
  | 'painLevel'
  | 'assignTriageLevel'
  | 'immediate'
  | 'emergent'
  | 'urgent'
  | 'semiUrgent'
  | 'nonUrgent'
  | 'notTriaged'
  | 'currentTriageLevel'
  | 'triageTimestamp'
  | 'emergencyTreatment'
  | 'initiateTreatment'
  | 'orderEmergencyDiagnostics'
  | 'noEmergencyCarePermissions'
  | 'age'
  | 'arrivalTime'
  | 'selectPatientToViewEmergencyCare'
  | 'triageLevelAssigned'
  | 'patientHasBeenTriaged'
  | 'treatmentInitiated'
  | 'emergencyTreatmentStarted'
  | 'vitalSignsRecorded'
  | 'vitalSignsUpdated'
  | 'triageRequired'
  | 'mustAssignTriageLevelFirst'
  | 'featureNotImplemented'
  | 'medicationAdministrationFormWouldOpen';

export const hospitalTranslations = {
  en: {
    hospitalWorkflows: 'Hospital Workflows',
    admission: 'Admission',
    inpatientCare: 'Inpatient Care',
    discharge: 'Discharge',
    inpatients: 'Inpatients',
    inpatientCareManagement: 'Inpatient Care Management',
    ongoingCare: 'Ongoing Care',
    admissionProcess: 'Admission Process',
    dischargeProcess: 'Discharge Process',
    createAdmissionOrders: 'Create Admission Orders',
    performAdmissionAssessment: 'Perform Admission Assessment',
    performMedicationReconciliation: 'Perform Medication Reconciliation',
    createDischargeOrders: 'Create Discharge Orders',
    completeDischargeSummary: 'Complete Discharge Summary',
    physicianActions: 'Physician Actions',
    nursingActions: 'Nursing Actions',
    nursingDischargeActions: 'Nursing Discharge Actions',
    physicianDischargeActions: 'Physician Discharge Actions',
    createDischargeInstructions: 'Create Discharge Instructions',
    admissionOrdersDescription: 'Create admission orders, specify level of care, and document admission diagnosis',
    nursingAdmissionDescription: 'Complete nursing admission assessment and medication reconciliation',
    dischargeOrdersDescription: 'Document discharge diagnosis and create necessary orders',
    nursingDischargeDescription: 'Create patient education materials and discharge instructions',
    noAdmissionPermissions: 'You do not have permission to perform admission tasks',
    noDischargePermissions: 'You do not have permission to perform discharge tasks',
    inpatientCareDescription: 'View and manage ongoing patient care during hospital stay',
    viewClinicalDocumentation: 'View Clinical Documentation',
    viewVitalSigns: 'View Vital Signs',
    viewMedicationAdministration: 'View Medication Administration',
    selectPatientToViewWorkflows: 'Select a patient to view hospital workflows',
    admittedOn: 'Admitted on',
    admissionOrderCreated: 'Admission Order Created',
    admissionOrderForPatient: 'Admission order created for patient: {name}',
    admissionAssessmentStarted: 'Admission Assessment Started',
    nursingAssessmentStarted: 'Nursing admission assessment has been initiated',
    medicationReconciliationStarted: 'Medication Reconciliation Started',
    reviewingPatientMedications: 'Reviewing patient medications on admission',
    dischargeOrderCreated: 'Discharge Order Created',
    patientMarkedForDischarge: 'Patient {name} has been marked for discharge',
    dischargeSummaryStarted: 'Discharge Summary Started',
    completingDischargeSummary: 'Creating discharge summary documentation',
    dischargeInstructionsCreated: 'Discharge Instructions Created',
    patientEducationMaterialsCreated: 'Patient education materials have been created',
    medicationAdministration: 'Medication Administration',
    medicationAdministrationRecord: 'Medication Administration Record',
    recordAdministration: 'Record Administration',
    administered: 'Administered',
    missed: 'Missed',
    held: 'Held',
    scheduled: 'Scheduled',
    scheduledTime: 'Scheduled Time',
    administeredBy: 'Administered By',
    route: 'Route',
    administer: 'Administer',
    hold: 'Hold',
    details: 'Details',
    medicationAdministered: 'Medication Administered',
    medicationAdministrationRecorded: 'Medication administration has been recorded',
    medicationHeld: 'Medication Held',
    medicationMarkedAsHeld: 'Medication has been marked as held',
    permissionDenied: 'Permission Denied',
    cannotAdministerMedications: 'You do not have permission to administer medications',
    viewOnlyMedicationAdministration: 'You are in view-only mode. Nurse permission is required to administer medications.',
    selectPatientToViewMedications: 'Select a patient to view medication administration record',
    emergencyCare: 'Emergency Care',
    emergencyTriage: 'Emergency Triage',
    emergencyDepartment: 'Emergency Department',
    registerNewPatient: 'Register New Patient',
    triage: 'Triage',
    wait: 'Wait',
    patientInformation: 'Patient Information',
    chiefComplaint: 'Chief Complaint',
    enterChiefComplaint: 'Enter chief complaint',
    vitalSigns: 'Vital Signs',
    updateVitals: 'Update Vitals',
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    respiratoryRate: 'Respiratory Rate',
    temperature: 'Temperature',
    oxygenSaturation: 'Oxygen Saturation',
    painLevel: 'Pain Level',
    assignTriageLevel: 'Assign Triage Level',
    immediate: 'Immediate',
    emergent: 'Emergent',
    urgent: 'Urgent',
    semiUrgent: 'Semi-Urgent',
    nonUrgent: 'Non-Urgent',
    notTriaged: 'Not Triaged',
    currentTriageLevel: 'Current Triage Level',
    triageTimestamp: 'Triage Time',
    emergencyTreatment: 'Emergency Treatment',
    initiateTreatment: 'Initiate Treatment',
    orderEmergencyDiagnostics: 'Order Emergency Diagnostics',
    noEmergencyCarePermissions: 'You do not have permission to perform emergency care tasks',
    age: 'Age',
    arrivalTime: 'Arrival Time',
    selectPatientToViewEmergencyCare: 'Select a patient to view emergency care workflow',
    triageLevelAssigned: 'Triage Level Assigned',
    patientHasBeenTriaged: 'Patient has been triaged as {level}',
    treatmentInitiated: 'Treatment Initiated',
    emergencyTreatmentStarted: 'Emergency treatment has been started',
    vitalSignsRecorded: 'Vital Signs Recorded',
    vitalSignsUpdated: 'Vital signs have been updated',
    triageRequired: 'Triage Required',
    mustAssignTriageLevelFirst: 'You must assign a triage level before initiating treatment',
    featureNotImplemented: 'Feature Not Implemented',
    medicationAdministrationFormWouldOpen: 'A medication administration form would open here'
  },
  pt: {
    hospitalWorkflows: 'Fluxos Hospitalares',
    admission: 'Admissão',
    inpatientCare: 'Cuidados Hospitalares',
    discharge: 'Alta',
    inpatients: 'Pacientes Internados',
    inpatientCareManagement: 'Gestão de Cuidados Hospitalares',
    ongoingCare: 'Cuidados Contínuos',
    admissionProcess: 'Processo de Admissão',
    dischargeProcess: 'Processo de Alta',
    createAdmissionOrders: 'Criar Ordens de Admissão',
    performAdmissionAssessment: 'Realizar Avaliação de Admissão',
    performMedicationReconciliation: 'Realizar Reconciliação Medicamentosa',
    createDischargeOrders: 'Criar Ordens de Alta',
    completeDischargeSummary: 'Completar Resumo de Alta',
    physicianActions: 'Ações do Médico',
    nursingActions: 'Ações de Enfermagem',
    nursingDischargeActions: 'Ações de Enfermagem para Alta',
    physicianDischargeActions: 'Ações Médicas para Alta',
    createDischargeInstructions: 'Criar Instruções de Alta',
    admissionOrdersDescription: 'Criar ordens de admissão, especificar nível de cuidado e documentar diagnóstico de admissão',
    nursingAdmissionDescription: 'Completar avaliação de enfermagem na admissão e reconciliação medicamentosa',
    dischargeOrdersDescription: 'Documentar diagnóstico de alta e criar ordens necessárias',
    nursingDischargeDescription: 'Criar materiais educativos para o paciente e instruções de alta',
    noAdmissionPermissions: 'Você não tem permissão para realizar tarefas de admissão',
    noDischargePermissions: 'Você não tem permissão para realizar tarefas de alta',
    inpatientCareDescription: 'Visualizar e gerenciar cuidados contínuos durante a internação',
    viewClinicalDocumentation: 'Ver Documentação Clínica',
    viewVitalSigns: 'Ver Sinais Vitais',
    viewMedicationAdministration: 'Ver Administração de Medicamentos',
    selectPatientToViewWorkflows: 'Selecione um paciente para ver os fluxos hospitalares',
    admittedOn: 'Admitido em',
    admissionOrderCreated: 'Ordem de Admissão Criada',
    admissionOrderForPatient: 'Ordem de admissão criada para o paciente: {name}',
    admissionAssessmentStarted: 'Avaliação de Admissão Iniciada',
    nursingAssessmentStarted: 'Avaliação de enfermagem de admissão foi iniciada',
    medicationReconciliationStarted: 'Reconciliação Medicamentosa Iniciada',
    reviewingPatientMedications: 'Revisando medicamentos do paciente na admissão',
    dischargeOrderCreated: 'Ordem de Alta Criada',
    patientMarkedForDischarge: 'Paciente {name} foi marcado para alta',
    dischargeSummaryStarted: 'Resumo de Alta Iniciado',
    completingDischargeSummary: 'Criando documentação de resumo de alta',
    dischargeInstructionsCreated: 'Instruções de Alta Criadas',
    patientEducationMaterialsCreated: 'Materiais educativos para o paciente foram criados',
    medicationAdministration: 'Administração de Medicamentos',
    medicationAdministrationRecord: 'Registro de Administração de Medicamentos',
    recordAdministration: 'Registrar Administração',
    administered: 'Administrado',
    missed: 'Não Administrado',
    held: 'Suspenso',
    scheduled: 'Programado',
    scheduledTime: 'Horário Programado',
    administeredBy: 'Administrado Por',
    route: 'Via',
    administer: 'Administrar',
    hold: 'Suspender',
    details: 'Detalhes',
    medicationAdministered: 'Medicamento Administrado',
    medicationAdministrationRecorded: 'Administração de medicamento foi registrada',
    medicationHeld: 'Medicamento Suspenso',
    medicationMarkedAsHeld: 'Medicamento foi marcado como suspenso',
    permissionDenied: 'Permissão Negada',
    cannotAdministerMedications: 'Você não tem permissão para administrar medicamentos',
    viewOnlyMedicationAdministration: 'Você está no modo de visualização. É necessária permissão de enfermagem para administrar medicamentos.',
    selectPatientToViewMedications: 'Selecione um paciente para ver o registro de administração de medicamentos',
    emergencyCare: 'Atendimento de Emergência',
    emergencyTriage: 'Triagem de Emergência',
    emergencyDepartment: 'Departamento de Emergência',
    registerNewPatient: 'Registrar Novo Paciente',
    triage: 'Triagem',
    wait: 'Espera',
    patientInformation: 'Informações do Paciente',
    chiefComplaint: 'Queixa Principal',
    enterChiefComplaint: 'Digite a queixa principal',
    vitalSigns: 'Sinais Vitais',
    updateVitals: 'Atualizar Vitais',
    heartRate: 'Frequência Cardíaca',
    bloodPressure: 'Pressão Arterial',
    respiratoryRate: 'Frequência Respiratória',
    temperature: 'Temperatura',
    oxygenSaturation: 'Saturação de Oxigênio',
    painLevel: 'Nível de Dor',
    assignTriageLevel: 'Atribuir Nível de Triagem',
    immediate: 'Imediato',
    emergent: 'Emergente',
    urgent: 'Urgente',
    semiUrgent: 'Semi-Urgente',
    nonUrgent: 'Não Urgente',
    notTriaged: 'Não Triado',
    currentTriageLevel: 'Nível de Triagem Atual',
    triageTimestamp: 'Hora da Triagem',
    emergencyTreatment: 'Tratamento de Emergência',
    initiateTreatment: 'Iniciar Tratamento',
    orderEmergencyDiagnostics: 'Solicitar Diagnósticos de Emergência',
    noEmergencyCarePermissions: 'Você não tem permissão para realizar tarefas de atendimento de emergência',
    age: 'Idade',
    arrivalTime: 'Hora de Chegada',
    selectPatientToViewEmergencyCare: 'Selecione um paciente para ver o fluxo de atendimento de emergência',
    triageLevelAssigned: 'Nível de Triagem Atribuído',
    patientHasBeenTriaged: 'Paciente foi triado como {level}',
    treatmentInitiated: 'Tratamento Iniciado',
    emergencyTreatmentStarted: 'Tratamento de emergência foi iniciado',
    vitalSignsRecorded: 'Sinais Vitais Registrados',
    vitalSignsUpdated: 'Sinais vitais foram atualizados',
    triageRequired: 'Triagem Necessária',
    mustAssignTriageLevelFirst: 'Você deve atribuir um nível de triagem antes de iniciar o tratamento',
    featureNotImplemented: 'Funcionalidade Não Implementada',
    medicationAdministrationFormWouldOpen: 'Um formulário de administração de medicamentos seria aberto aqui'
  }
};
