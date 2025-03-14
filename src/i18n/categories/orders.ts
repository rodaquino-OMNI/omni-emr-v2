
export type OrdersTranslationKey =
  | 'examType'
  | 'bodyPart'
  | 'useContrast'
  | 'clinicalReason'
  | 'patientPreparation'
  | 'priority'
  | 'routine'
  | 'urgent'
  | 'stat'
  | 'selectExamType'
  | 'selectBodyPart'
  | 'clinicalReasonPlaceholder'
  | 'patientPrepPlaceholder'
  | 'xRay'
  | 'ctScan'
  | 'mri'
  | 'ultrasound'
  | 'petScan'
  | 'mammogram'
  | 'dexaScan'
  | 'fluoroscopy'
  | 'head'
  | 'neck'
  | 'chest'
  | 'abdomen'
  | 'pelvis'
  | 'spine'
  | 'upperExtremity'
  | 'lowerExtremity'
  | 'wholeBody';

export const ordersTranslations = {
  pt: {
    examType: 'Tipo de Exame',
    bodyPart: 'Parte do Corpo',
    useContrast: 'Usar Contraste',
    clinicalReason: 'Justificativa Clínica',
    patientPreparation: 'Preparação do Paciente',
    priority: 'Prioridade',
    routine: 'Rotina',
    urgent: 'Urgente',
    stat: 'Imediato',
    selectExamType: 'Selecionar tipo de exame',
    selectBodyPart: 'Selecionar parte do corpo',
    clinicalReasonPlaceholder: 'Justificativa para este exame...',
    patientPrepPlaceholder: 'Instruções para preparo do paciente...',
    xRay: 'Raio-X',
    ctScan: 'Tomografia Computadorizada',
    mri: 'Ressonância Magnética',
    ultrasound: 'Ultrassom',
    petScan: 'PET Scan',
    mammogram: 'Mamografia',
    dexaScan: 'Densitometria Óssea',
    fluoroscopy: 'Fluoroscopia',
    head: 'Cabeça',
    neck: 'Pescoço',
    chest: 'Tórax',
    abdomen: 'Abdômen',
    pelvis: 'Pelve',
    spine: 'Coluna',
    upperExtremity: 'Membros Superiores',
    lowerExtremity: 'Membros Inferiores',
    wholeBody: 'Corpo Inteiro'
  },
  en: {
    examType: 'Exam Type',
    bodyPart: 'Body Part',
    useContrast: 'Use Contrast',
    clinicalReason: 'Clinical Reason',
    patientPreparation: 'Patient Preparation',
    priority: 'Priority',
    routine: 'Routine',
    urgent: 'Urgent',
    stat: 'STAT',
    selectExamType: 'Select exam type',
    selectBodyPart: 'Select body part',
    clinicalReasonPlaceholder: 'Reason for this exam...',
    patientPrepPlaceholder: 'Instructions for patient preparation...',
    xRay: 'X-Ray',
    ctScan: 'CT Scan',
    mri: 'MRI',
    ultrasound: 'Ultrasound',
    petScan: 'PET Scan',
    mammogram: 'Mammogram',
    dexaScan: 'DEXA Scan',
    fluoroscopy: 'Fluoroscopy',
    head: 'Head',
    neck: 'Neck',
    chest: 'Chest',
    abdomen: 'Abdomen',
    pelvis: 'Pelvis',
    spine: 'Spine',
    upperExtremity: 'Upper Extremity',
    lowerExtremity: 'Lower Extremity',
    wholeBody: 'Whole Body'
  }
};
