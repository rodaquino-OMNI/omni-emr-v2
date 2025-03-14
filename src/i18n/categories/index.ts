
import { commonTranslations, CommonTranslationKey } from './common';
import { authTranslations, AuthTranslationKey } from './auth';
import { appointmentsTranslations, AppointmentsTranslationKey } from './appointments';
import { medicationsTranslations, MedicationsTranslationKey } from './medications';
import { ordersTranslations, OrdersTranslationKey } from './orders';
import { patientsTranslations, PatientsTranslationKey } from './patients';
import { tasksTranslations, TasksTranslationKey } from './tasks';
import { usersTranslations, UsersTranslationKey } from './users';
import { vitalsTranslations, VitalsTranslationKey } from './vitals';
import { medicalHistoryTranslations, MedicalHistoryTranslationKey } from './medicalHistory';
import { hospitalTranslations, HospitalTranslationKey } from './hospital';

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
};

export type TranslationKey =
  | CommonTranslationKey
  | AuthTranslationKey
  | AppointmentsTranslationKey
  | MedicationsTranslationKey
  | OrdersTranslationKey
  | PatientsTranslationKey
  | TasksTranslationKey
  | UsersTranslationKey
  | VitalsTranslationKey
  | MedicalHistoryTranslationKey
  | HospitalTranslationKey;

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
  hospital: hospitalTranslations
};
