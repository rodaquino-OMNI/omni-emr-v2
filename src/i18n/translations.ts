
import { commonTranslations } from './categories/common';
import { authTranslations } from './categories/auth';
import { patientsTranslations } from './categories/patients';
import { medicationsTranslations } from './categories/medications';
import { appointmentsTranslations } from './categories/appointments';
import { ordersTranslations } from './categories/orders';
import { tasksTranslations } from './categories/tasks';
import { telemedicineTranslations } from './categories/telemedicine';
import { vitalsTranslations } from './categories/vitals';
import { medicalHistoryTranslations } from './categories/medicalHistory';
import { usersTranslations } from './categories/users';
import { validationsTranslations } from './categories/validations';
import { hospitalTranslations } from './categories/hospital';
import { emergencyTranslations } from './categories/emergency';

// Merge all translation categories
export const translations = {
  en: {
    ...commonTranslations.en,
    ...authTranslations.en,
    ...patientsTranslations.en,
    ...medicationsTranslations.en,
    ...appointmentsTranslations.en,
    ...ordersTranslations.en,
    ...tasksTranslations.en,
    ...telemedicineTranslations.en,
    ...vitalsTranslations.en,
    ...medicalHistoryTranslations.en,
    ...usersTranslations.en,
    ...validationsTranslations.en,
    ...hospitalTranslations.en,
    ...emergencyTranslations.en,
  },
  pt: {
    ...commonTranslations.pt,
    ...authTranslations.pt,
    ...patientsTranslations.pt,
    ...medicationsTranslations.pt,
    ...appointmentsTranslations.pt,
    ...ordersTranslations.pt,
    ...tasksTranslations.pt,
    ...telemedicineTranslations.pt,
    ...vitalsTranslations.pt,
    ...medicalHistoryTranslations.pt,
    ...usersTranslations.pt,
    ...validationsTranslations.pt,
    ...hospitalTranslations.pt,
    ...emergencyTranslations.pt,
  }
};
