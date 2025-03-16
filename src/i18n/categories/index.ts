
import { commonTranslations } from './common';
import { authTranslations } from './auth';
import { appointmentsTranslations } from './appointments';
import { medicationsTranslations } from './medications';
import { ordersTranslations } from './orders';
import { patientsTranslations } from './patients';
import { tasksTranslations } from './tasks';
import { usersTranslations } from './users';
import { vitalsTranslations } from './vitals';
import { medicalHistoryTranslations } from './medicalHistory';
import { hospitalTranslations } from './hospital';
import { emergencyTranslations } from './emergency';
import { telemedicineTranslations } from './telemedicine';

export type TranslationCategories = {
  common: typeof commonTranslations.en;
  auth: typeof authTranslations.en;
  appointments: typeof appointmentsTranslations.en;
  medications: typeof medicationsTranslations.en;
  orders: typeof ordersTranslations.en;
  patients: typeof patientsTranslations.en;
  tasks: typeof tasksTranslations.en;
  users: typeof usersTranslations.en;
  vitals: typeof vitalsTranslations.en;
  medicalHistory: typeof medicalHistoryTranslations.en;
  hospital: typeof hospitalTranslations.en;
  emergency: typeof emergencyTranslations.en;
  telemedicine: typeof telemedicineTranslations.en;
};

// Define TranslationKey as string for now, which is safer and more flexible
export type TranslationKey = string;

export const allTranslations = {
  common: commonTranslations,
  auth: authTranslations,
  appointments: appointmentsTranslations,
  medications: medicationsTranslations,
  orders: ordersTranslations,
  patients: patientsTranslations,
  tasks: tasksTranslations,
  users: usersTranslations,
  vitals: vitalsTranslations,
  medicalHistory: medicalHistoryTranslations,
  hospital: hospitalTranslations,
  emergency: emergencyTranslations,
  telemedicine: telemedicineTranslations
};
