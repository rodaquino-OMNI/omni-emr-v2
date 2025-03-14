
import { authTranslations } from './categories/auth';
import { commonTranslations } from './categories/common';
import { tasksTranslations } from './categories/tasks';
import { patientsTranslations } from './categories/patients';
import { appointmentsTranslations } from './categories/appointments';
import { ordersTranslations } from './categories/orders';
import { usersTranslations } from './categories/users';
import { medicationsTranslations } from './categories/medications';
import { medicalHistoryTranslations } from './categories/medicalHistory';
import { vitalsTranslations } from './categories/vitals';

export const translations = {
  en: {
    ...authTranslations.en,
    ...commonTranslations.en,
    ...tasksTranslations.en,
    ...patientsTranslations.en,
    ...appointmentsTranslations.en,
    ...ordersTranslations.en,
    ...usersTranslations.en,
    ...medicationsTranslations.en,
    ...medicalHistoryTranslations.en,
    ...vitalsTranslations.en,
  },
  pt: {
    ...authTranslations.pt,
    ...commonTranslations.pt,
    ...tasksTranslations.pt,
    ...patientsTranslations.pt,
    ...appointmentsTranslations.pt,
    ...ordersTranslations.pt,
    ...usersTranslations.pt,
    ...medicationsTranslations.pt,
    ...medicalHistoryTranslations.pt,
    ...vitalsTranslations.pt,
  }
};

export type TranslationKey = keyof typeof translations.en;
