
interface HospitalTranslations {
  admissionProcess: string;
  physicianActions: string;
  createAdmissionOrders: string;
  admissionOrdersDescription: string;
  nursingActions: string;
  performAdmissionAssessment: string;
  performMedicationReconciliation: string;
  nursingAdmissionDescription: string;
  noAdmissionPermissions: string;
  inpatientCareManagement: string;
  ongoingCare: string;
  inpatientCareDescription: string;
  viewClinicalDocumentation: string;
  viewVitalSigns: string;
  viewMedicationAdministration: string;
  dischargeProcess: string;
  physicianDischargeActions: string;
  createDischargeOrders: string;
  completeDischargeSummary: string;
  dischargeOrdersDescription: string;
  nursingDischargeActions: string;
  createDischargeInstructions: string;
  nursingDischargeDescription: string;
  noDischargePermissions: string;
  admission: string;
  discharge: string;
  inpatientCare: string;
  admissionOrderCreated: string;
  admissionOrderForPatient: string;
  admissionAssessmentStarted: string;
  nursingAssessmentStarted: string;
  medicationReconciliationStarted: string;
  reviewingPatientMedications: string;
  dischargeOrderCreated: string;
  patientMarkedForDischarge: string;
  dischargeSummaryStarted: string;
  completingDischargeSummary: string;
  dischargeInstructionsCreated: string;
  patientEducationMaterialsCreated: string;
  // Adding missing translation keys
  hospitalWorkflows: string;
  inpatients: string;
  admittedOn: string;
  selectPatientToViewWorkflows: string;
}

export type HospitalTranslationKey = keyof HospitalTranslations;

export const hospitalTranslations = {
  en: {
    admissionProcess: "Admission Process",
    physicianActions: "Physician Actions",
    createAdmissionOrders: "Create Admission Orders",
    admissionOrdersDescription: "Create initial orders for patient admission",
    nursingActions: "Nursing Actions",
    performAdmissionAssessment: "Perform Admission Assessment",
    performMedicationReconciliation: "Perform Medication Reconciliation",
    nursingAdmissionDescription: "Complete nursing assessment and documentation",
    noAdmissionPermissions: "You don't have permissions to perform admission actions",
    inpatientCareManagement: "Inpatient Care Management",
    ongoingCare: "Ongoing Care",
    inpatientCareDescription: "Manage the patient's ongoing care during their hospital stay",
    viewClinicalDocumentation: "View Clinical Documentation",
    viewVitalSigns: "View Vital Signs",
    viewMedicationAdministration: "View Medication Administration",
    dischargeProcess: "Discharge Process",
    physicianDischargeActions: "Physician Discharge Actions",
    createDischargeOrders: "Create Discharge Orders",
    completeDischargeSummary: "Complete Discharge Summary",
    dischargeOrdersDescription: "Create orders and summary for patient discharge",
    nursingDischargeActions: "Nursing Discharge Actions",
    createDischargeInstructions: "Create Discharge Instructions",
    nursingDischargeDescription: "Create patient education and discharge instructions",
    noDischargePermissions: "You don't have permissions to perform discharge actions",
    admission: "Admission",
    discharge: "Discharge",
    inpatientCare: "Inpatient Care",
    admissionOrderCreated: "Admission Order Created",
    admissionOrderForPatient: "Admission order has been created for the patient",
    admissionAssessmentStarted: "Admission Assessment Started",
    nursingAssessmentStarted: "Nursing admission assessment has been started",
    medicationReconciliationStarted: "Medication Reconciliation Started",
    reviewingPatientMedications: "Reviewing patient medications in progress",
    dischargeOrderCreated: "Discharge Order Created",
    patientMarkedForDischarge: "Patient has been marked for discharge",
    dischargeSummaryStarted: "Discharge Summary Started",
    completingDischargeSummary: "Completing the discharge summary documentation",
    dischargeInstructionsCreated: "Discharge Instructions Created",
    patientEducationMaterialsCreated: "Patient education materials have been created",
    // Adding missing translation keys
    hospitalWorkflows: "Hospital Workflows",
    inpatients: "Inpatients",
    admittedOn: "Admitted On",
    selectPatientToViewWorkflows: "Select a patient to view hospital workflows"
  },
  pt: {
    admissionProcess: "Processo de Admissão",
    physicianActions: "Ações do Médico",
    createAdmissionOrders: "Criar Ordens de Admissão",
    admissionOrdersDescription: "Criar ordens iniciais para admissão do paciente",
    nursingActions: "Ações de Enfermagem",
    performAdmissionAssessment: "Realizar Avaliação de Admissão",
    performMedicationReconciliation: "Realizar Reconciliação Medicamentosa",
    nursingAdmissionDescription: "Completar avaliação e documentação de enfermagem",
    noAdmissionPermissions: "Você não tem permissões para realizar ações de admissão",
    inpatientCareManagement: "Gestão de Cuidados Hospitalares",
    ongoingCare: "Cuidados Contínuos",
    inpatientCareDescription: "Gerenciar os cuidados contínuos do paciente durante sua estadia no hospital",
    viewClinicalDocumentation: "Ver Documentação Clínica",
    viewVitalSigns: "Ver Sinais Vitais",
    viewMedicationAdministration: "Ver Administração de Medicamentos",
    dischargeProcess: "Processo de Alta",
    physicianDischargeActions: "Ações de Alta do Médico",
    createDischargeOrders: "Criar Ordens de Alta",
    completeDischargeSummary: "Completar Resumo de Alta",
    dischargeOrdersDescription: "Criar ordens e resumo para alta do paciente",
    nursingDischargeActions: "Ações de Alta da Enfermagem",
    createDischargeInstructions: "Criar Instruções de Alta",
    nursingDischargeDescription: "Criar educação do paciente e instruções de alta",
    noDischargePermissions: "Você não tem permissões para realizar ações de alta",
    admission: "Admissão",
    discharge: "Alta",
    inpatientCare: "Cuidados Hospitalares",
    admissionOrderCreated: "Ordem de Admissão Criada",
    admissionOrderForPatient: "Ordem de admissão foi criada para o paciente",
    admissionAssessmentStarted: "Avaliação de Admissão Iniciada",
    nursingAssessmentStarted: "Avaliação de admissão de enfermagem foi iniciada",
    medicationReconciliationStarted: "Reconciliação Medicamentosa Iniciada",
    reviewingPatientMedications: "Revisão dos medicamentos do paciente em andamento",
    dischargeOrderCreated: "Ordem de Alta Criada",
    patientMarkedForDischarge: "Paciente foi marcado para alta",
    dischargeSummaryStarted: "Resumo de Alta Iniciado",
    completingDischargeSummary: "Completando a documentação do resumo de alta",
    dischargeInstructionsCreated: "Instruções de Alta Criadas",
    patientEducationMaterialsCreated: "Materiais educativos para o paciente foram criados",
    // Adding missing translation keys
    hospitalWorkflows: "Fluxos de Trabalho Hospitalares",
    inpatients: "Pacientes Internados",
    admittedOn: "Admitido Em",
    selectPatientToViewWorkflows: "Selecione um paciente para ver os fluxos de trabalho hospitalares"
  }
};
